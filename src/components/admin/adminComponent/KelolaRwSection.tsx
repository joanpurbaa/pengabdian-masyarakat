import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
	adminMedisService,
	type GetAllRWResponse,
} from "../../../service/adminMedisService";
import { adminDesaService } from "../../../service/adminDesaService";
import type { AxiosError } from "axios";

export default function KelolaRwSection() {
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const isAdminPath = pathSegments[0] === "admin";

	const [addRwPopUp, setAddRwPopUp] = useState(false);
	const [newJumlahRw, setNewJumlahRw] = useState<number>(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [rwData, setRwData] = useState<GetAllRWResponse | null>(null);
	const [rwCount, setRwCount] = useState<number>(0);
	const [rtCount, setRtCount] = useState<number>(0);
	const [userCount, setUserCount] = useState<number>(0);

	useEffect(() => {
		fetchRWData();
	}, []);

	const fetchRWData = async () => {
		try {
			setLoading(true);
			const data = await adminMedisService.getAllRW();
			setRwData(data);
			setRwCount(data.data.length);
			setRtCount(data.metadata.rtCount);
			setUserCount(data.metadata.userCount);
		} catch (err) {
			const error = err as AxiosError;
			console.error("Error fetching RW data:", error);
			setError("Gagal memuat data RW");
		} finally {
			setLoading(false);
		}
	};

	const handleTambahRw = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newJumlahRw || newJumlahRw < 1) return;

		try {
			await adminDesaService.addRW(newJumlahRw);
			window.location.reload();
		} catch (err) {
			const error = err as AxiosError;
			console.error("Error adding RW:", error);
			alert("Gagal menambahkan RW");
		}
	};

	const handleHapus = async (rwId: string) => {
		if (window.confirm("Apakah Anda yakin ingin menghapus RW ini?")) {
			try {
				await adminDesaService.deleteRW(rwId);
				window.location.reload();
			} catch (err) {
				const error = err as AxiosError;
				console.error("Error deleting RW:", error);
				alert("Gagal menghapus RW");
			}
		}
	};

	const handleBatal = () => {
		setAddRwPopUp(false);
	};

	const getBasePath = () => {
		return isAdminPath ? "/admin" : "/admin-medis";
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg">Memuat data RW...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-red-500 text-lg">{error}</div>
			</div>
		);
	}

	return (
		<>
			<main className="grid grid-cols-12 gap-6">
				<StatCard count={rwCount} label="Total RW" />
				<StatCard count={rtCount} label="Total RT" />
				<StatCard count={userCount} label="Total Warga" />

				<div className="col-span-12">
					<RWTable
						rwData={rwData}
						basePath={getBasePath()}
						onAddClick={() => setAddRwPopUp(true)}
						onDelete={handleHapus}
					/>
				</div>
			</main>

			{addRwPopUp && (
				<AddRWPopup
					value={newJumlahRw}
					onChange={setNewJumlahRw}
					onSubmit={handleTambahRw}
					onCancel={handleBatal}
				/>
			)}
		</>
	);
}

function StatCard({ count, label }: { count: number; label: string }) {
	return (
		<div className="col-span-4">
			<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
				<div className="relative z-10">
					<h1 className="text-[#70B748] text-6xl font-bold">{count}</h1>
					<p className="text-gray-600 text-lg mt-2">{label}</p>
				</div>
				<div className="absolute -right-7 -bottom-7">
					<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
				</div>
			</div>
		</div>
	);
}

function RWTable({
	rwData,
	basePath,
	onAddClick,
	onDelete,
}: {
	rwData: GetAllRWResponse | null;
	basePath: string;
	onAddClick: () => void;
	onDelete: (rwId: string) => void;
}) {
	return (
		<div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
			<div className="flex justify-between items-center pb-3">
				<div className="text-gray-600 font-medium">
					<Link to={`${basePath}/kelola-rw`} className="hover:underline">
						Kelola RW
					</Link>
				</div>
				<button
					onClick={onAddClick}
					className="cursor-pointer bg-[#70B748] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
					<Plus size={16} />
					Tambah RW
				</button>
			</div>

			<div className="bg-white rounded-xl overflow-hidden shadow-sm">
				<TableHeader />
				<TableBody rwData={rwData} basePath={basePath} onDelete={onDelete} />
			</div>
		</div>
	);
}

function TableHeader() {
	return (
		<div className="bg-[#70B748] text-white">
			<div className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base">
				<div className="col-span-3 font-semibold">Nama RW</div>
				<div className="col-span-2 text-center font-semibold">Jumlah RT</div>
				<div className="col-span-2 text-center font-semibold">Total Warga</div>
				<div className="col-span-3 text-center font-semibold">Lihat Detail</div>
				<div className="col-span-2 text-center font-semibold">Aksi</div>
			</div>
		</div>
	);
}

function TableBody({
	rwData,
	basePath,
	onDelete,
}: {
	rwData: GetAllRWResponse | null;
	basePath: string;
	onDelete: (rwId: string) => void;
}) {
	return (
		<div className="divide-y divide-gray-200">
			{rwData?.data.map((rw, index) => (
				<div
					key={rw.id}
					className={`grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50 ${
						index % 2 === 0 ? "bg-white" : "bg-gray-50"
					}`}>
					<div className="col-span-3 text-gray-700 font-medium">RW {rw.name}</div>
					<div className="col-span-2 text-center text-gray-700">{rw.rtCount}</div>
					<div className="col-span-2 text-center text-gray-700">{rw.userCount}</div>
					<div className="col-span-3 text-center">
						<Link
							to={`${basePath}/kelola-rw/${rw.id}`}
							className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors inline-block">
							Kelola RW
						</Link>
					</div>
					<div className="col-span-2 text-center">
						<button
							onClick={() => onDelete(rw.id)}
							className="cursor-pointer bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
							Hapus
						</button>
					</div>
				</div>
			))}
		</div>
	);
}

function AddRWPopup({
	value,
	onChange,
	onSubmit,
	onCancel,
}: {
	value: number;
	onChange: (value: number) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}) {
	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/50">
			<div className="bg-white p-5 rounded-md space-y-5 w-[400px]">
				<h1 className="font-bold text-lg">Tambah RW Baru</h1>
				<form onSubmit={onSubmit}>
					<ul className="space-y-6">
						<li className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Jumlah RW Baru
							</label>
							<input
								className="outline-none border border-gray-300 w-full px-3 py-2 rounded-md focus:border-[#70B748] focus:ring-1 focus:ring-[#70B748]"
								type="number"
								value={value}
								onChange={(e) => onChange(Number(e.target.value))}
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
								onClick={onCancel}
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
	);
}
