import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function KelolaRtSection({ rwId }: { rwId: string }) {
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const [addRwPopUp, setAddRwPopUp] = useState(false);
	const [newJumlahRw, setNewJumlahRw] = useState<number>(1);

	const [rwData, setRwData] = useState([
		{ id: 1, name: "RT 1", jumlahKeluarga: 3 },
		{ id: 2, name: "RT 2", jumlahKeluarga: 11 },
	]);

	const totalRw = rwData.length;
	const totalRt = rwData.reduce((sum, rw) => sum + rw.jumlahKeluarga, 0);

	const handleHapus = (id: number) => {
		setRwData(rwData.filter((rw) => rw.id !== id));
	};

	const handleTambahRw = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newJumlahRw || newJumlahRw < 1) return;

		const lastId = rwData.length > 0 ? rwData[rwData.length - 1].id : 0;

		const newRws = Array.from({ length: newJumlahRw }, (_, i) => ({
			id: lastId + i + 1,
			name: `RT ${lastId + i + 1}`,
			jumlahKeluarga: 2,
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
				<div className="col-span-6">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">{totalRw} RT</h1>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-6">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">{totalRt} RT</h1>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
						<div className="absolute -right-10 -bottom-3">
							<img src="/home1.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-12">
					<div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
						<div className="flex justify-between items-center pb-3">
							<div className="mt-4 text-zinc-600 font-medium">
								<Link
									to={
										pathSegments[0] == "admin"
											? `/admin/responden`
											: `/admin-medis/responden`
									}
									className="hover:underline">
									Data RW
								</Link>{" "}
								/{" "}
								<Link
									to={
										pathSegments[0] == "admin"
											? `/admin/${currentSection}/${rwId}`
											: `/admin-medis/${currentSection}/${rwId}`
									}
									className="hover:underline">
									Data {rwId}
								</Link>
							</div>
							<button
								onClick={() => setAddRwPopUp(true)}
								className="cursor-pointer bg-[#70B748] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
								<Plus size={16} />
								Tambah RT
							</button>
						</div>

						<div className="bg-white rounded-xl overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="bg-[#70B748] text-white">
										<th className="text-left py-4 px-6 font-medium">Nama RT</th>
										<th className="text-left py-4 px-6 font-medium">Jumlah Keluarga</th>
										<th className="text-left py-4 px-6 font-medium">Lihat</th>
										<th className="text-left py-4 px-6 font-medium">Hapus</th>
									</tr>
								</thead>
								<tbody>
									{rwData.map((rw, index) => (
										<tr
											key={rw.id}
											className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
											<td className="py-4 px-6 font-medium text-gray-900">{rw.name}</td>
											<td className="py-4 px-6 text-gray-700">{rw.jumlahKeluarga}</td>
											<td className="py-4 px-6">
												<Link
													to={"/admin?panel=kelola-rw-rt/rw1"}
													className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors">
													Lihat
												</Link>
											</td>
											<td className="py-4 px-6">
												<button
													onClick={() => handleHapus(rw.id)}
													className="cursor-pointer bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
													Hapus
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>

			{addRwPopUp && (
				<div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black/50">
					<div className="bg-white p-5 rounded-md space-y-5 w-[400px]">
						<h1 className="font-bold">Tambah RT</h1>
						<form onSubmit={handleTambahRw}>
							<ul className="space-y-6">
								<li className="space-y-2">
									<label className="block text-sm font-medium">Jumlah RT Baru</label>
									<input
										className="outline-none border w-full px-3 py-2 rounded-md"
										type="number"
										value={newJumlahRw}
										onChange={(e) => setNewJumlahRw(Number(e.target.value))}
										min={1}
									/>
								</li>
								<li className="flex gap-3">
									<button
										type="button"
										onClick={handleBatal}
										className="cursor-pointer w-full bg-red-400 hover:bg-red-500 text-white rounded-md p-2">
										Batal
									</button>
									<button
										type="submit"
										className="cursor-pointer w-full bg-[#70B748] hover:bg-green-600 text-white rounded-md p-2">
										Tambah
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
