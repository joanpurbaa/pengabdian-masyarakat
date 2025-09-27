import type { RTType, RWType } from "../types/types";

export const filterRWByDateRange = (
	dataRW: RWType[],
	startDate: string,
	endDate: string
) => {
	if (!startDate && !endDate) return dataRW;

	const start = startDate ? new Date(startDate) : null;
	const end = endDate ? new Date(endDate) : null;

	return dataRW
		.map((rw: RWType) => {
			const filteredRT = rw.rt.map((rt) => {
				const filteredWarga = rt.warga.filter((warga) => {
					const tanggalTerakhir = new Date(warga.tanggalTerakhir);

					if (start && end) {
						return tanggalTerakhir >= start && tanggalTerakhir <= end;
					} else if (start) {
						return tanggalTerakhir >= start;
					} else if (end) {
						return tanggalTerakhir <= end;
					}
					return true;
				});

				return {
					...rt,
					warga: filteredWarga,
				};
			});

			return {
				...rw,
				rt: filteredRT,
			};
		})
		.filter((rw: RWType) => {
			return rw.rt.some((rt) => rt.warga.length > 0);
		});
};

export const filterRTByDate = (
	rtData: RTType[],
	startDate: string,
	endDate: string
) => {
	if (!startDate && !endDate) return rtData;

	const start = startDate ? new Date(startDate) : null;
	const end = endDate ? new Date(endDate) : null;

	return rtData
		.map((rt: RTType) => {
			const filteredWarga = rt.warga.filter((warga) => {
				const tanggalTerakhir = new Date(warga.tanggalTerakhir);

				if (start && end) {
					return tanggalTerakhir >= start && tanggalTerakhir <= end;
				} else if (start) {
					return tanggalTerakhir >= start;
				} else if (end) {
					return tanggalTerakhir <= end;
				}
				return true;
			});

			return {
				...rt,
				warga: filteredWarga,
			};
		})
		.filter((rt: RTType) => rt.warga.length > 0);
};

export const calculateOverallStats = (dataRW: RWType[]) => {
	const allWarga = dataRW.flatMap((rw) => rw.rt.flatMap((rt) => rt.warga));
	const totalWarga = allWarga.length;
	const tidakStabilCount = allWarga.filter(
		(warga) => warga.statusMental === "Tidak Stabil"
	).length;

	const overallDepressionRate =
		totalWarga > 0 ? Math.round((tidakStabilCount / totalWarga) * 100) : 0;

	return {
		totalWarga,
		tidakStabilCount,
		overallDepressionRate,
	};
};

export const calculateRTStats = (rt: RTType) => {
	const totalWarga = rt.warga.length;
	const tidakStabilCount = rt.warga.filter(
		(warga) => warga.statusMental === "Tidak Stabil"
	).length;
	const tingkatDepresi =
		totalWarga > 0 ? Math.round((tidakStabilCount / totalWarga) * 100) : 0;

	return {
		id: rt.id,
		nama: rt.nama,
		jumlahKeluarga: totalWarga,
		tingkatDepresi,
		tidakStabilCount,
	};
};

export const calculateRWStats = (rw: RWType) => {
	const allWarga = rw.rt.flatMap((rt) => rt.warga);
	const totalWarga = allWarga.length;
	const tidakStabilCount = allWarga.filter(
		(warga) => warga.statusMental === "Tidak Stabil"
	).length;

	const tanggalTerakhirList = allWarga
		.map((warga) => warga.tanggalTerakhir)
		.sort();
	const tanggalTerakhir =
		tanggalTerakhirList.length > 0
			? tanggalTerakhirList[tanggalTerakhirList.length - 1]
			: null;

	const tingkatDepresi =
		totalWarga > 0 ? Math.round((tidakStabilCount / totalWarga) * 100) : 0;

	return {
		id: rw.id,
		nama: rw.nama,
		jumlahRT: rw.rt.filter((rt) => rt.warga.length > 0).length,
		totalWarga,
		tidakStabilCount,
		tingkatDepresi,
		tanggalTerakhir,
	};
};

export const formatDisplayDate = (dateString: string) => {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "long",
		year: "numeric",
	};
	return date.toLocaleDateString("id-ID", options);
};
