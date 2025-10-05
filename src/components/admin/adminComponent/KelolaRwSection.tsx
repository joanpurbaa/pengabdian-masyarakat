import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function KelolaRwSection() {
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const [addRwPopUp, setAddRwPopUp] = useState(false);
	const [newJumlahRw, setNewJumlahRw] = useState<number>(1);

	const [rwData, setRwData] = useState([
		{ id: 1, name: "RW 1", jumlahRt: 2, totalWarga: 15 },
		{ id: 2, name: "RW 2", jumlahRt: 2, totalWarga: 12 },
		{ id: 3, name: "RW 3", jumlahRt: 2, totalWarga: 8 },
		{ id: 4, name: "RW 4", jumlahRt: 2, totalWarga: 0 },
		{ id: 5, name: "RW 5", jumlahRt: 2, totalWarga: 0 },
	]);

	const totalRw = rwData.length;
	const totalRt = rwData.reduce((sum, rw) => sum + rw.jumlahRt, 0);
	const totalWarga = rwData.reduce((sum, rw) => sum + rw.totalWarga, 0);

	const handleHapus = (id: number) => {
		setRwData(rwData.filter((rw) => rw.id !== id));
	};

	const handleTambahRw = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newJumlahRw || newJumlahRw < 1) return;

		const lastId = rwData.length > 0 ? rwData[rwData.length - 1].id : 0;

		const newRws = Array.from({ length: newJumlahRw }, (_, i) => ({
			id: lastId + i + 1,
			name: `RW ${lastId + i + 1}`,
			jumlahRt: 0,
			totalWarga: 0,
		}));

		setRwData([...rwData, ...newRws]);
		setNewJumlahRw(1);
		setAddRwPopUp(false);
	};

	const handleBatal = () => {
		setAddRwPopUp(false);
	};

	return (
		<>
			<main className="grid grid-cols-12 gap-6">
				<div className="col-span-4">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">{totalRw}</h1>
							<p className="text-gray-600 text-lg mt-2">Total RW</p>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

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
								</Link>
							</div>
							<button
								onClick={() => setAddRwPopUp(true)}
								className="cursor-pointer bg-[#70B748] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
								<Plus size={16} />
								Tambah RW
							</button>
						</div>

						<div className="bg-white rounded-xl overflow-hidden shadow-sm">
							<div className="bg-[#70B748] text-white">
								<div className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base">
									<div className="col-span-3 font-semibold">Nama RW</div>
									<div className="col-span-2 text-center font-semibold">Jumlah RT</div>
									<div className="col-span-2 text-center font-semibold">Total Warga</div>
									<div className="col-span-3 text-center font-semibold">
										Lihat Detail
									</div>
									<div className="col-span-2 text-center font-semibold">Aksi</div>
								</div>
							</div>

							<div className="divide-y divide-gray-200">
								{rwData.map((rw, index) => (
									<div
										key={rw.id}
										className={`grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50 ${
											index % 2 === 0 ? "bg-white" : "bg-gray-50"
										}`}>
										<div className="col-span-3 text-gray-700 font-medium">{rw.name}</div>
										<div className="col-span-2 text-center text-gray-700">
											{rw.jumlahRt}
										</div>
										<div className="col-span-2 text-center text-gray-700">
											{rw.totalWarga}
										</div>
										<div className="col-span-3 text-center">
											<Link
												to={
													pathSegments[0] == "admin"
														? `/admin/kelola-rw/rw${rw.id}`
														: `/admin-medis/kelola-rw/rw${rw.id}`
												}
												className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors inline-block">
												Kelola RT
											</Link>
										</div>
										<div className="col-span-2 text-center">
											<button
												onClick={() => handleHapus(rw.id)}
												className="cursor-pointer bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
												Hapus
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>

			{addRwPopUp && (
				<div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/50">
					<div className="bg-white p-5 rounded-md space-y-5 w-[400px]">
						<h1 className="font-bold text-lg">Tambah RW Baru</h1>
						<form onSubmit={handleTambahRw}>
							<ul className="space-y-6">
								<li className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">
										Jumlah RW Baru
									</label>
									<input
										className="outline-none border border-gray-300 w-full px-3 py-2 rounded-md focus:border-[#70B748] focus:ring-1 focus:ring-[#70B748]"
										type="number"
										value={newJumlahRw}
										onChange={(e) => setNewJumlahRw(Number(e.target.value))}
										min={1}
										max={10}
									/>
									<p className="text-sm text-gray-500">
										Maksimal 10 RW dapat ditambahkan sekaligus
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
										Tambah RW
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
