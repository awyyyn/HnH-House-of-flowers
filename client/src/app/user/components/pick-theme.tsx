import { ScrollArea } from "@/components";
import { wrappers } from "@/constants";

interface PickThemeProps {
	selected: string;
	handleSelect: (id: string) => void;
}

export default function PickTheme({ handleSelect, selected }: PickThemeProps) {
	return (
		<ScrollArea className="  md:min-h-[60dvh]  md:min-w-[50%] xl:min-w-[50dvw] min-w-screen min-h-[50dvh]  overflow-y-auto  border p-5s scroll-p-5 rounded-lg">
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 auto-auto-flow p-5">
				{wrappers.map((wrapper, index) => (
					<div
						onClick={() => handleSelect(wrapper.id)}
						key={`${wrapper.name}-${index}`}
						className={`  group overflow-hidden relative   p-2 border shadow-primary/40 cursor-pointer transition-all duration-500  rounded-xl ${
							selected === wrapper.id
								? "   border-primary/10 shadow-lg "
								: "border-transparent  hover:border-primary/10 hover:shadow-lg "
						} 
							max-h-[220px]
						`}>
						<img
							className={`group-hover:scale-105 scale-90 duration-700 transition-all h-[85%] w-full object-contain ${
								selected === wrapper.id ? " scale-105 " : " "
							}`}
							src={wrapper.image}
							alt={wrapper.name}
						/>
						<p className="p-2 ">{wrapper.name}</p>
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
