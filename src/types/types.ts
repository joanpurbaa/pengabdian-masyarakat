export interface WargaType {
	id: string;
	nama: string;
	tanggalTerakhir: string;
	tanggalDisplay: string;
	statusMental: string;
}

export interface RTType {
	id: string;
	nama: string;
	warga: WargaType[];
}

export interface RWType {
	id: string;
	nama: string;
	rt: RTType[];
}

export interface RTStatsType {
	id: string;
	nama: string;
	jumlahKeluarga: number;
	tingkatDepresi: number;
	tidakStabilCount: number;
}

export interface Question {
	id: number;
	pertanyaan: string;
	description?: string;
	jawaban: string;
	statusToggle: boolean;
}

export interface QuestionFormData {
	title: string;
	description: string;
	status: "draft" | "published";
}

export interface ApiQuestion {
	id?: number;
	title: string;
	description: string;
	status: "draft" | "published";
	createdAt?: string;
	updatedAt?: string;
}

export interface QuestionnaireResponse {
	success: boolean;
	data?: any;
	error?: string;
}
