export interface RTData {
	rtId: string;
	rtName: number;
	userCount: number;
	submitCount: number;
	stableMentalCount: number;
	unStableMentalCount: number;
	unStableMentalPercentage: number;
}

export interface RWSummary {
	summarize: {
		userCount: number;
		submitCount: number;
		stableMentalCount: number;
		unStableMentalCount: number;
		unStableMentalPercentage: number;
	};
	perRt: RTData[];
}

export interface QuestionnaireSummary {
	summarize: {
		userCount: number;
		submitCount: number;
		stableMentalCount: number;
		unStableMentalCount: number;
		unStableMentalPercentage: number;
	};
	perRw: RWSectionData[];
}

export interface RWSectionData {
	name: string;
	id: string;
	rwId: string;
	rwName: number;
	rtCount: number;
	userCount: number;
	submitCount: number;
	stableMentalCount: number;
	unStableMentalCount: number;
	unStableMentalPercentage: number;
}

export interface Questionnaire {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	status: "publish" | "draft" | "archived";
}

export interface QuestionnaireQuestion {
	id: string;
	questionText: string;
	questionType: string;
	status: string;
	QuestionnaireId: string;
	order?: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateQuestionPayload {
	questionText: string;
	questionType: "radio" | "checkbox" | "text";
	status: "publish" | "draft";
	QuestionnaireId: string;
}

export interface BulkUpdateQuestionPayload {
	id: string;
	questionText: string;
	questionType: string;
	status: "publish" | "draft";
	order: number;
}

export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

export interface WargaData {
	id: string;
	nama: string;
	tanggalTerakhir: string;
	tanggalDisplay: string;
	statusMental: "Stabil" | "Tidak Stabil";
}

export interface RTDetail {
	rtId: string;
	rtName: string;
	warga: WargaData[];
}

export interface WargaHistory {
	id: string;
	tanggal: string;
	skor: number;
	status: string;
	detailJawaban: Array<{
		questionId: string;
		questionText: string;
		answer: string;
	}>;
}

export interface CreateQuestionnairePayload {
	title: string;
	description: string;
	riskThreshold: number | 0;
	status: "draft" | "publish";
}

export interface UpdateQuestionnairePayload {
	title: string;
	description: string;
	status: "draft" | "publish";
}

export interface RTSummary {
	summarize: {
		userCount: number;
		submitCount: number;
		stableMentalCount: number;
		unStableMentalCount: number;
		unStableMentalPercentage: number;
	};
	users: Array<{
		userId: string;
		fullname: string;
		nik?: string;
		lastSubmissionDate: string;
	}>;
}

export interface QueryParams {
	RukunWargaId?: string;
	RukunTetanggaId?: string;
	startDate?: string;
	endDate?: string;
}

export interface SummarizeAllResponse {
	statusCode: number;
	message: string;
	data: {
		summarize: {
			userCount: number;
			submitCount: number;
			stableMentalCount: number;
			unStableMentalCount: number;
			unStableMentalPercentage: number;
		};
		perRw: RWSectionData[];
	};
}

export interface GetAllRWResponse {
	statusCode: number;
	message: string;
	data: RWSectionData[];
	metadata: {
		rtCount: number;
		userCount: number;
	};
}
