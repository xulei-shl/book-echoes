#!/usr/bin/env node

/**
 * Clean R2 Content Script
 * 
 * 删除 R2 对象存储中指定路径下的所有文件
 * 
 * Usage:
 *   node scripts/clean-r2-content.mjs 2025/2025-09           # 删除月份牌内容
 *   node scripts/clean-r2-content.mjs 2025/new/2025-07       # 删除睡美人内容
 *   node scripts/clean-r2-content.mjs 2025/subject/科幻      # 删除主题卡内容
 *   node scripts/clean-r2-content.mjs --dry-run 2025/2025-09 # 预览模式，不实际删除
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_FILES = ['.env.local', '.env'];

/**
 * Main execution function
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ 请提供要删除的路径');
        printUsage();
        process.exit(1);
    }

    const isDryRun = args.includes('--dry-run');
    const targetPath = args.find(arg => !arg.startsWith('--'));
    
    if (!targetPath) {
        console.error('❌ 请提供要删除的路径');
        printUsage();
        process.exit(1);
    }

    console.log(`\n🗑️  准备清理 R2 路径: ${targetPath}`);
    if (isDryRun) {
        console.log('🔍 预览模式：不会实际删除文件\n');
    }

    try {
        await loadEnvFiles();
        const r2Config = createR2Config();

        if (!r2Config.shouldUpload) {
            console.error('❌ R2 配置无效或未启用上传功能');
            process.exit(1);
        }

        // Step 1: 列出要删除的对象
        console.log('📋 正在列出要删除的对象...');
        const objectsToDelete = await listObjectsToDelete(r2Config, targetPath);
        
        if (objectsToDelete.length === 0) {
            console.log('✅ 指定路径下没有找到任何对象');
            return;
        }

        console.log(`\n📊 找到 ${objectsToDelete.length} 个对象待删除:`);
        objectsToDelete.forEach(obj => {
            console.log(`   - ${obj.Key}`);
        });

        if (isDryRun) {
            console.log('\n🔍 预览模式结束，未执行实际删除操作');
            return;
        }

        // Step 2: 确认删除操作
        console.log('\n⚠️  即将删除上述对象，此操作不可逆！');
        console.log('请在 10 秒内按 Ctrl+C 取消操作...');
        
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Step 3: 执行删除操作
        console.log('\n🗑️  开始删除对象...');
        const deleteResult = await deleteObjects(r2Config, objectsToDelete);
        
        console.log(`\n✅ 删除操作完成:`);
        console.log(`   成功删除: ${deleteResult.deleted?.length || 0} 个对象`);
        if (deleteResult.errors?.length > 0) {
            console.log(`   删除失败: ${deleteResult.errors.length} 个对象`);
            deleteResult.errors.forEach(error => {
                console.error(`   ❌ ${error.Key}: ${error.Message}`);
            });
        }

    } catch (error) {
        console.error(`\n❌ 清理失败:`, error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

/**
 * 列出指定路径下的所有对象
 */
async function listObjectsToDelete(r2Config, targetPath) {
    const objects = [];
    let continuationToken = null;
    
    // 构建前缀路径
    const prefix = buildR2Key(r2Config, 'content', targetPath);
    console.log(`🔍 搜索前缀: ${prefix}`);
    
    do {
        try {
            const command = new ListObjectsV2Command({
                Bucket: r2Config.bucket,
                Prefix: prefix,
                ContinuationToken: continuationToken,
                MaxKeys: 1000 // 每次最多查询1000个对象
            });

            const response = await r2Config.client.send(command);
            
            if (response.Contents) {
                objects.push(...response.Contents);
                console.log(`📦 已获取 ${response.Contents.length} 个对象 (总计: ${objects.length})`);
            }
            
            continuationToken = response.NextContinuationToken;
            
        } catch (error) {
            console.error(`❌ 列出对象时出错: ${error.message}`);
            throw error;
        }
    } while (continuationToken);

    return objects;
}

/**
 * 批量删除对象
 */
async function deleteObjects(r2Config, objects) {
    const batchSize = 1000; // R2 批量删除限制
    const results = {
        deleted: [],
        errors: []
    };

    for (let i = 0; i < objects.length; i += batchSize) {
        const batch = objects.slice(i, i + batchSize);
        console.log(`🗑️  正在删除第 ${Math.floor(i/batchSize) + 1} 批 (${batch.length} 个对象)...`);

        try {
            const command = new DeleteObjectsCommand({
                Bucket: r2Config.bucket,
                Delete: {
                    Objects: batch.map(obj => ({ Key: obj.Key })),
                    Quiet: false
                }
            });

            const response = await r2Config.client.send(command);
            
            if (response.Deleted) {
                results.deleted.push(...response.Deleted);
            }
            
            if (response.Errors) {
                results.errors.push(...response.Errors);
            }
            
            console.log(`✅ 第 ${Math.floor(i/batchSize) + 1} 批删除完成`);
            
        } catch (error) {
            console.error(`❌ 删除第 ${Math.floor(i/batchSize) + 1} 批时出错: ${error.message}`);
            
            // 将整个批次标记为错误
            results.errors.push(...batch.map(obj => ({
                Key: obj.Key,
                Message: error.message
            })));
        }
    }

    return results;
}

/**
 * 构建 R2 对象键
 */
function buildR2Key(r2Config, ...segments) {
    const cleaned = segments
        .filter(Boolean)
        .map(segment => String(segment).replace(/\\/g, '/').replace(/^\/+|\/+$/g, ''));
    const base = (r2Config?.basePath ?? '').replace(/^\/+|\/+$/g, '');
    if (base) {
        cleaned.unshift(base);
    }
    return cleaned.filter(Boolean).join('/');
}

/**
 * 创建 R2 配置
 */
function createR2Config() {
    const shouldUploadEnv = (process.env.UPLOAD_TO_R2 ?? 'true').toLowerCase() !== 'false';
    const endpoint = process.env.R2_ENDPOINT;
    const bucket = process.env.R2_BUCKET_NAME;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const basePath = (process.env.R2_BASE_PATH ?? '').replace(/^\/+|\/+$/g, '');
    const publicUrl = (process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

    let client = null;
    let enableUpload = shouldUploadEnv;

    if (enableUpload) {
        if (endpoint && bucket && accessKeyId && secretAccessKey) {
            client = new S3Client({
                region: 'auto',
                endpoint,
                credentials: {
                    accessKeyId,
                    secretAccessKey
                },
                forcePathStyle: true
            });
            
            console.log('✅ R2 客户端配置成功');
            console.log(`   Endpoint: ${endpoint}`);
            console.log(`   Bucket: ${bucket}`);
            console.log(`   Base Path: ${basePath || '(无)'}`);
        } else {
            console.warn('⚠️  R2 配置信息缺失');
            if (!endpoint) console.warn('   - R2_ENDPOINT 未设置');
            if (!bucket) console.warn('   - R2_BUCKET_NAME 未设置');
            if (!accessKeyId) console.warn('   - R2_ACCESS_KEY_ID 未设置');
            if (!secretAccessKey) console.warn('   - R2_SECRET_ACCESS_KEY 未设置');
            enableUpload = false;
        }
    }

    return {
        client,
        bucket,
        basePath,
        publicUrl,
        shouldUpload: enableUpload && !!client
    };
}

/**
 * 加载环境变量文件
 */
async function loadEnvFiles() {
    for (const filename of ENV_FILES) {
        const envPath = path.join(PROJECT_ROOT, filename);
        try {
            const content = await fs.readFile(envPath, 'utf-8');
            applyEnvFile(content);
        } catch {
            // Ignore missing files
        }
    }
}

/**
 * 应用环境变量文件内容
 */
function applyEnvFile(content) {
    const lines = content.split(/\r?\n/);
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) {
            continue;
        }
        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }
        const key = line.slice(0, separatorIndex).trim();
        if (!key || process.env[key]) {
            continue;
        }
        const valueRaw = line.slice(separatorIndex + 1).trim();
        const value = valueRaw.replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
    }
}

/**
 * 打印使用说明
 */
function printUsage() {
    console.log('\n用法示例:');
    console.log('  node scripts/clean-r2-content.mjs 2025/2025-09           # 删除月份牌内容');
    console.log('  node scripts/clean-r2-content.mjs 2025/new/2025-07       # 删除睡美人内容');
    console.log('  node scripts/clean-r2-content.mjs 2025/subject/科幻      # 删除主题卡内容');
    console.log('  node scripts/clean-r2-content.mjs --dry-run 2025/2025-09 # 预览模式，不实际删除\n');
}

// Run the script
main();