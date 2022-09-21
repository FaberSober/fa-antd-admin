import FaberBase from '@/props/base/FaberBase';

namespace Article {
	export enum BookBizType {
		Help = 'Help',
    StdMark = 'StdMark', // 标准标注
	}

	/** 文章-书本 */
	export interface Book extends FaberBase.BaseDelEntity {
		/** ID */
		id: number;
		/** 书名  */
		name: string;
		/** 业务类型  */
		bizType: BookBizType;
		/** 业务ID  */
		bizId: string;
		/** 封面图  */
		cover: string;
		/** 描述  */
		description: string;
		/** 是否发布  */
		pub: boolean;
		/** 发布时间  */
		pubTime: string;
	}

	/** 文章-大纲 */
	export interface Outline extends FaberBase.BaseDelEntity {
		/**  */
		id: number;
		/** 书本ID  */
		bookId: number;
		/** 详情ID  */
		detailId: number;
		/** 父级节点  */
		parentId: number;
		/** 标题  */
		title: string;
		/** 图标  */
		icon: string;
		/** 排序  */
		sort: number;
	}

	export interface OutlineDetailVo extends Outline {
		detail: Detail;
	}

	/** 文章-详情 */
	export interface Detail extends FaberBase.BaseDelEntity {
		/**  */
		id: number;
		/** 大纲ID  */
		outlineId: string;
		/** html文本  */
		detail: string;
	}
}

export default Article;
