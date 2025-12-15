'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Book } from '@/types';

// 创建一个测试用的主题书籍
const testBook: Book = {
    id: '54121111369781',
    month: '2025-subject-数字遗产的幽灵之舞',
    title: '屏幕上的受苦者',
    author: '[德] 黑特·史德耶尔（Hito Steyerl）',
    publisher: '上海人民出版社',
    pubYear: '2023',
    pages: '225',
    rating: '8',
    callNumber: 'J05-53/5021',
    callNumberLink: 'https://vufind.library.sh.cn/Search/Results?searchtype=vague&lookfor=J05-53%2F5021&type=CallNumber',
    isbn: '978-7-208-18746-7',
    recommendation: '当文章以《物华弥新》为样本，拆解数字媒介如何让文物在虚拟空间中获得新生时，《屏幕上的受苦者》则像一台X光机，照亮了数字影像背后的权力结构与物性错位。',
    reason: '',
    summary: '🖥 数字时代的领军艺术家，登顶艺术权力榜的女性艺术家代表作首次中译',
    authorIntro: '作者\n黑特·史德耶尔（Hito Steyerl，1966—），德国视觉艺术家、理论学者、电影制作人，德国柏林艺术大学新媒体艺术专业教授。',
    catalog: '前 言\n导 言\n自由落体:关于垂直视角的思想实验\n为弱影像辩护\n像你我一样的事物\n博物馆是工厂吗?\n抗议的接合\n艺术的政治:当代艺术与后民主的转向\n艺术作为职业/占领:生命自主性的主张\n摆脱一切的自由:自由职业者与雇佣军\n失踪者:纠缠、叠加和挖掘作为不确定性的场域\n来自地球的垃圾邮件:从再现中撤退\n剪切/削减! 再生产与再组合\n致 谢',
    coverUrl: 'https://img1.doubanio.com/view/subject/l/public/s34798169.jpg',
    cardThumbnailUrl: 'https://book-echoes.xulei-shl.asia/data/content/2025/subject/数字遗产的幽灵之舞/54121111369781/54121111369781_thumb.jpg',
    translator: '乌兰托雅',
    doubanLink: 'https://book.douban.com/subject/36780608/',
};

export default function TestSubjectPage() {
    const [currentBook, setCurrentBook] = useState<Book | null>(null);

    useEffect(() => {
        // 模拟点击书籍
        setTimeout(() => {
            setCurrentBook(testBook);
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            <Header showHomeButton={true} theme="dark" currentBook={currentBook} />
            
            <div className="pt-32 px-8">
                <h1 className="text-white text-2xl mb-4">主题文档功能测试页面</h1>
                
                {!currentBook ? (
                    <p className="text-white">正在加载测试书籍...</p>
                ) : (
                    <div className="space-y-4">
                        <p className="text-white">已加载测试书籍：</p>
                        <div className="bg-[#2a2a2a] p-4 rounded-lg">
                            <h2 className="text-xl text-white mb-2">{currentBook.title}</h2>
                            <p className="text-gray-300">作者: {currentBook.author}</p>
                            <p className="text-gray-300">月份: {currentBook.month}</p>
                            <p className="text-gray-300">
                                是否为主题卡: {currentBook.month.includes('-subject-') ? '是' : '否'}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setCurrentBook(null)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            清除选中
                        </button>
                        
                        <button
                            onClick={() => setCurrentBook(testBook)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2"
                        >
                            重新选中
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}