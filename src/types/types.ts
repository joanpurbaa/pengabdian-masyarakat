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
