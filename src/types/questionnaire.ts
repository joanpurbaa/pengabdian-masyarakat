export interface Questionnaire {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	status: "draft" | "publish";
}

export interface Question {
	id: string;
	createdAt: string;
	updatedAt: string;
	questionText: string;
	questionType: "radio" | "text" | "checkbox";
	status: "draft" | "publish";
	order: number;
	QuestionnaireId: string;
}

export interface QuestionnaireDetail extends Questionnaire {
	questions: Question[];
}

export interface CreateQuestionnaireData {
	title: string;
	description: string;
	status: "draft" | "publish";
}

export interface UpdateQuestionnaireData {
	title?: string;
	description?: string;
	status?: "draft" | "publish";
}

export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}
