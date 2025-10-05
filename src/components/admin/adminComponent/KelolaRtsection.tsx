import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function KelolaRtSection({ rwId }: { rwId: string }) {
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const [addRtPopUp, setAddRtPopUp] = useState(false);
	const [newJumlahRt, setNewJumlahRt] = useState<number>(1);

	const [rtData, setRtData] = useState([
		{ id: 1, name: "RT 1", jumlahKeluarga: 3, totalWarga: 12 },
		{ id: 2, name: "RT 2", jumlahKeluarga: 4, totalWarga: 15 },
		{ id: 3, name: "RT 3", jumlahKeluarga: 2, totalWarga: 8 },
	]);

	const totalRt = rtData.length;
	const totalKeluarga = rtData.reduce((sum, rt) => sum + rt.jumlahKeluarga, 0);
	const totalWarga = rtData.reduce((sum, rt) => sum + rt.totalWarga, 0);

	const handleHapus = (id: number) => {
		setRtData(rtData.filter((rt) => rt.id !== id));
	};

	const handleTambahRt = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newJumlahRt || newJumlahRt < 1) return;

		const lastId = rtData.length > 0 ? rtData[rtData.length - 1].id : 0;

		const newRts = Array.from({ length: newJumlahRt }, (_, i) => ({
			id: lastId + i + 1,
			name: `RT ${lastId + i + 1}`,
			jumlahKeluarga: 0,
			totalWarga: 0,
		}));

		setRtData([...rtData, ...newRts]);
		setNewJumlahRt(1);
		setAddRtPopUp(false);
	};

	const handleBatal = () => {
		setAddRtPopUp(false);
	};

	return (
		<>
			<main className="grid grid-cols-12 gap-6">
				<div className="col-span-4">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">{totalRt}</h1>
							<p className="text-gray-600 text-lg mt-2">Total RT</p>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-4">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">{totalKeluarga}</h1>
							<p className="text-gray-600 text-lg mt-2">Total Keluarga</p>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-4">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">{totalWarga}</h1>
							<p className="text-gray-600 text-lg mt-2">Total Warga</p>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-12">
					<div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
						<div className="flex justify-between items-center pb-3">
							<div className="text-gray-600 font-medium">
								<Link
									to={
										pathSegments[0] == "admin"
											? `/admin/kelola-rw`
											: `/admin-medis/kelola-rw`
									}
									className="hover:underline">
									Kelola RW
								</Link>{" "}
								/{" "}
								<Link
									to={
										pathSegments[0] == "admin"
											? `/admin/${currentSection}/${rwId}`
											: `/admin-medis/${currentSection}/${rwId}`
									}
									className="hover:underline">
									{rwId.toUpperCase()}
								</Link>
							</div>
							<button
								onClick={() => setAddRtPopUp(true)}
								className="cursor-pointer bg-[#70B748] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
								<Plus size={16} />
								Tambah RT
							</button>
						</div>

						<div className="bg-white rounded-xl overflow-hidden shadow-sm">
							<div className="bg-[#70B748] text-white">
								<div className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base">
									<div className="col-span-3 font-semibold">Nama RT</div>
									<div className="col-span-2 text-center font-semibold">
										Jumlah Keluarga
									</div>
									<div className="col-span-2 text-center font-semibold">Total Warga</div>
									<div className="col-span-3 text-center font-semibold">
										Kelola Warga
									</div>
									<div className="col-span-2 text-center font-semibold">Aksi</div>
								</div>
							</div>

							<div className="divide-y divide-gray-200">
								{rtData.length === 0 ? (
									<div className="py-8 text-center text-gray-500">
										<p>Belum ada data RT di {rwId.toUpperCase()}.</p>
										<p className="text-sm mt-2">Tambahkan RT baru untuk memulai.</p>
									</div>
								) : (
									rtData.map((rt, index) => (
										<div
											key={rt.id}
											className={`grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50 ${
												index % 2 === 0 ? "bg-white" : "bg-gray-50"
											}`}>
											<div className="col-span-3 text-gray-700 font-medium">{rt.name}</div>
											<div className="col-span-2 text-center text-gray-700">
												{rt.jumlahKeluarga}
											</div>
											<div className="col-span-2 text-center text-gray-700">
												{rt.totalWarga}
											</div>
											<div className="col-span-3 text-center">
												{/* PERBAIKAN DI SINI: Link ke kelola warga */}
												<Link
													to={
														pathSegments[0] == "admin"
															? `/admin/kelola-rw/${rwId}/rt${rt.id}`
															: `/admin-medis/kelola-rw/${rwId}/rt${rt.id}`
													}
													className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors inline-block">
													Kelola Warga
												</Link>
											</div>
											<div className="col-span-2 text-center">
												<button
													onClick={() => handleHapus(rt.id)}
													className="cursor-pointer bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
													Hapus
												</button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			{addRtPopUp && (
				<div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/50">
					<div className="bg-white p-5 rounded-md space-y-5 w-[400px]">
						<h1 className="font-bold text-lg">Tambah RT Baru</h1>
						<form onSubmit={handleTambahRt}>
							<ul className="space-y-6">
								<li className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">
										Jumlah RT Baru
									</label>
									<input
										className="outline-none border border-gray-300 w-full px-3 py-2 rounded-md focus:border-[#70B748] focus:ring-1 focus:ring-[#70B748]"
										type="number"
										value={newJumlahRt}
										onChange={(e) => setNewJumlahRt(Number(e.target.value))}
										min={1}
										max={10}
									/>
									<p className="text-sm text-gray-500">
										Maksimal 10 RT dapat ditambahkan sekaligus
									</p>
								</li>
								<li className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={handleBatal}
										className="cursor-pointer w-full bg-gray-400 hover:bg-gray-500 text-white rounded-md p-3 font-medium transition-colors">
										Batal
									</button>
									<button
										type="submit"
										className="cursor-pointer w-full bg-[#70B748] hover:bg-green-600 text-white rounded-md p-3 font-medium transition-colors">
										Tambah RT
									</button>
								</li>
							</ul>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
