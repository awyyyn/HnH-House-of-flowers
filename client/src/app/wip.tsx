import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { Rocket } from "lucide-react";

export default function WorkInProgress() {
	return (
		<>
			<div className="  translate-y-[50%] flex items-center justify-center   p-4">
				<Card className="w-full max-w-md mx-auto text-center">
					<CardHeader>
						<div className="w-24 h-24 mx-auto mb-4">
							<Rocket className="w-full h-full text-primary" />
						</div>
						<CardTitle className="text-2xl">Work in Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							We're currently working on something exciting. Stay tuned for our
							upcoming features!
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
