import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Helmet,
} from "@/components";
import heroImg from "../assets/hero-img.png";
import {
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandTwitter,
} from "@tabler/icons-react";
import { ChevronRight, Flower, Star } from "lucide-react";

import { Link } from "react-router-dom";
import { Product, Review } from "@/types";

import { useEffect, useState } from "react";
import { HomeSkeleton } from "./skeletons";
import { formatCurrency } from "@/lib";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<{
		topProducts: Product[];
		reviews: Review[];
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
			const data = await res.json();
			setData(data);
			setError(null);
		} catch (err) {
			console.error("FETCH_DATA_ERR", err);
			setError("Internal server error!");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading || !data) return <HomeSkeleton />;

	console.log(data, "qqq");

	return (
		<>
			<Helmet title="Home" />
			{error ? (
				<div className="flex min-h-screen flex-col">
					<main className="flex-1">
						<div className="container px-4 py-16 md:py-24 lg:py-32">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
									An error occurred while loading the page
								</h1>
								<p className="text-muted-foreground">{error}</p>
								<Button onClick={fetchData}>Try again</Button>
							</div>
						</div>
					</main>
				</div>
			) : (
				<div className="flex min-h-screen flex-col">
					{" "}
					<main className="flex-1">
						<section className="relative">
							<div className="container px-4 py-16 md:py-24 lg:py-32">
								<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_500px]">
									<div className="flex flex-col justify-center space-y-4">
										<div className="space-y-2">
											<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
												Fresh Flowers for Every Occasion
											</h1>
											<p className="max-w-[600px] text-muted-foreground md:text-xl">
												Handcrafted bouquets delivered to your doorstep.
												Brighten someone's day with our beautiful arrangements.
											</p>
										</div>
										<div className="flex flex-col gap-2 min-[400px]:flex-row">
											<Link
												to="/flowers"
												className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
												Shop Now
											</Link>
											<Link
												to="/customize"
												className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
												Customize Bouquet
											</Link>
										</div>
									</div>
									<div className="flex items-center justify-center">
										<img
											// src="https://img.lovepik.com/free-png/20210919/lovepik-hand-painted-flower-bouquet-png-image_400451110_wh1200.png"
											src={heroImg}
											alt="Beautiful flower bouquet"
											width={550}
											height={550}
											className="aspect-square rounded-lg object-cover"
										/>
									</div>
								</div>
							</div>
						</section>

						<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
							<div className="container px-4 md:px-6">
								<div className="flex flex-col items-center justify-center space-y-4 text-center">
									<div className="space-y-2">
										<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
											Shop by Category
										</h2>
										<p className="max-w-[900px] text-muted-foreground md:text-xl">
											Find the perfect flowers for any occasion or recipient
										</p>
									</div>
								</div>
								<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
									{[
										{
											name: "Bouquets",
											image:
												"https://www.floretflowers.com/wp-content/uploads/2016/02/Floret_Market-Bouquets-14.jpg",
										},
										{
											name: "Flowers",
											image:
												"https://images.pexels.com/photos/697259/pexels-photo-697259.jpeg?cs=srgb&dl=pexels-hieu-697259.jpg&fm=jpg",
										},
										{
											name: "Chocolates",
											image:
												"https://www.thespruceeats.com/thmb/FhHcgQni8lgV0griUeDJMTAszxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chocolate_hero1-d62e5444a8734f8d8fe91f5631d51ca5.jpg",
										},
										{
											name: "Gifts",
											image:
												"https://www.realsimple.com/thmb/1nO0GmEuF87RSxFBmTWtfo6TZW0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-gift-giver-GettyImages-1706575747-2089a300e6594496b7f558585a4baefb.jpg",
										},
									].map((category) => (
										<Link
											key={category.name}
											to={`/${category.name.toLowerCase()}`}
											className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
											<img
												src={category.image || "/placeholder.svg"}
												alt={category.name}
												width={300}
												height={300}
												className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
											<div className="absolute bottom-0 left-0 w-full p-4">
												<h3 className="text-xl font-semibold text-white">
													{category.name}
												</h3>
											</div>
										</Link>
									))}
								</div>
							</div>
						</section>
						{data.topProducts && data.topProducts.length > 0 && (
							<section className="w-full py-12 md:py-24 lg:py-32">
								<div className="container px-4 md:px-6">
									<div className="flex flex-col items-center justify-center space-y-4 text-center">
										<div className="space-y-2">
											<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
												Bestselling Products
											</h2>
											<p className="max-w-[900px] text-muted-foreground md:text-xl">
												Our most popular products, loved by customers
											</p>
										</div>
									</div>
									<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
										{data.topProducts.map((product) => (
											<div
												key={product.name}
												className="group relative overflow-hidden rounded-lg border bg-background shadow-sm">
												<Link
													to={`/${product.category.toLowerCase()}s/${
														product.id
													}`}
													className="relative block overflow-hidden">
													<img
														src={product.images[0]}
														alt={product.name}
														width={300}
														height={400}
														className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
													/>
													{/* <Button
														size="icon"
														variant="ghost"
														className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-rose-500 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
														<Heart className="h-4 w-4" />
														<span className="sr-only">Add to wishlist</span>
													</Button> */}
												</Link>
												<div className="p-4">
													<h3 className="font-medium">{product.name}</h3>
													<p className="text-sm text-muted-foreground">
														{formatCurrency(product.price)}
													</p>
													{/* <div className="mt-4 flex items-center justify-between">
														<Button
															size="sm"
															variant="outline"
															className="w-full">
															Add to Cart
														</Button>
													</div> */}
												</div>
											</div>
										))}
									</div>
									<div className="mt-12 flex justify-center">
										<Link
											to="/flowers"
											className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
											View All Products
											<ChevronRight className="ml-1 h-4 w-4" />
										</Link>
									</div>
								</div>
							</section>
						)}

						<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
							<div className="container px-4 md:px-6">
								<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
									<div className="flex flex-col justify-center space-y-4">
										<div className="space-y-2">
											<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
												Why Choose Us
											</h2>
											<p className="max-w-[600px] text-muted-foreground md:text-xl">
												We're passionate about delivering fresh, beautiful
												flowers and exceptional service
											</p>
										</div>
										<ul className="grid gap-6">
											<li className="flex items-start gap-4">
												<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
													1
												</div>
												<div className="space-y-1">
													<h3 className="font-medium">Fresh Flowers Daily</h3>
													<p className="text-sm text-muted-foreground">
														We source our flowers directly from local growers to
														ensure freshness and quality.
													</p>
												</div>
											</li>
											<li className="flex items-start gap-4">
												<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
													2
												</div>
												<div className="space-y-1">
													<h3 className="font-medium">Expert Florists</h3>
													<p className="text-sm text-muted-foreground">
														Our team of skilled florists craft each arrangement
														with care and attention to detail.
													</p>
												</div>
											</li>
											<li className="flex items-start gap-4">
												<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
													3
												</div>
												<div className="space-y-1">
													<h3 className="font-medium">Same-Day Delivery</h3>
													<p className="text-sm text-muted-foreground">
														Order by 1 PM for same-day delivery to surprise your
														loved ones.
													</p>
												</div>
											</li>
										</ul>
									</div>
									<div className="flex items-center justify-center">
										<img
											src="https://images.stockcake.com/public/3/c/8/3c83e6c8-1ba7-4f55-bdf5-e4d45dce2f47_large/florist-arranging-flowers-stockcake.jpg"
											alt="Florist arranging flowers"
											width={550}
											height={550}
											className="aspect-square rounded-lg object-cover"
										/>
									</div>
								</div>
							</div>
						</section>

						{data.reviews && data.reviews.length > 0 && (
							<section className="w-full py-12 md:py-24 lg:py-32">
								<div className="container px-4 md:px-6">
									<div className="flex flex-col items-center justify-center space-y-4 text-center">
										<div className="space-y-2">
											<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
												What Our Customers Say
											</h2>
											<p className="max-w-[900px] text-muted-foreground md:text-xl">
												Don't just take our word for it - hear from our
												satisfied customers
											</p>
										</div>
									</div>
									<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
										{data.reviews.map((review, index) => {
											const normalizedRating = Math.min(
												Math.max(0, review.rating),
												5
											);
											return (
												<div
													key={index}
													className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
													<div className="space-y-4">
														<p className="text-muted-foreground">
															"{review.comment}"
														</p>
														<div className="flex items-center">
															{[...Array(5)].map((_, index) => (
																<Star
																	key={index}
																	className={`w-4 h-4 ${
																		index < normalizedRating
																			? "text-yellow-400 fill-yellow-400"
																			: "text-gray-300"
																	}`}
																/>
															))}
															<span className="ml-2 text-sm text-gray-600">
																{normalizedRating} out of {5}
															</span>
														</div>
													</div>
													<div className="mt-6 flex items-center gap-4">
														<div className="h-10 w-10 rounded-full bg-muted">
															<Avatar>
																<AvatarImage src={review.user.photo} />
																<AvatarFallback>
																	{review.user.firstName?.charAt(0)}
																	{review.user.lastName?.charAt(0)}
																</AvatarFallback>
															</Avatar>
														</div>
														<div>
															<p className="text-sm font-medium capitalize">
																{review.user.firstName} {review.user.lastName}
															</p>
															<p className="text-xs text-muted-foreground">
																Verified Customer
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</section>
						)}

						{/* <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
						<div className="container px-4 md:px-6">
							<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
								<div className="flex flex-col justify-center space-y-4">
									<div className="space-y-2">
										<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
											Subscribe to Our Newsletter
										</h2>
										<p className="max-w-[600px] md:text-xl">
											Stay updated with our latest collections, seasonal offers,
											and flower care tips
										</p>
									</div>
								</div>
								<div className="flex flex-col items-start gap-4 sm:flex-row">
									<div className="w-full">
										<Input
											type="email"
											placeholder="Enter your email"
											className="w-full bg-primary-foreground text-primary"
										/>
									</div>
									<Button className="shrink-0 bg-background text-primary hover:bg-background/90">
										Subscribe
									</Button>
								</div>
							</div>
						</div>
					</section> */}
					</main>
					<footer className="w-full border-t bg-background py-6 md:py-12">
						<div className="container px-4 md:px-6">
							<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
								<div className="space-y-4">
									<Link to="" className="flex items-center gap-2">
										<Flower />
										<span className="font-semibold">House of Flowers</span>
									</Link>
									<p className="text-sm text-muted-foreground">
										Bringing beauty and joy through fresh flowers since 2010.
									</p>
									<div className="flex gap-4">
										<Link
											to="https://facebook.com"
											target="_blank"
											className="text-muted-foreground hover:text-foreground">
											<IconBrandFacebook className="h-5 w-5" />
											<span className="sr-only">Facebook</span>
										</Link>
										<Link
											to="#"
											className="text-muted-foreground hover:text-foreground">
											<IconBrandInstagram className="h-5 w-5" />
											<span className="sr-only">Instagram</span>
										</Link>
										<Link
											to="#"
											className="text-muted-foreground hover:text-foreground">
											<IconBrandTwitter className="h-5 w-5" />
											<span className="sr-only">Twitter</span>
										</Link>
									</div>
								</div>
								<div className="space-y-4">
									<h3 className="text-sm font-medium">Shop</h3>
									<ul className="space-y-2 text-sm">
										<li>
											<Link
												to="/flowers"
												className="text-muted-foreground hover:text-foreground">
												Flowers
											</Link>
										</li>
										<li>
											<Link
												to="/bouquets"
												className="text-muted-foreground hover:text-foreground">
												Bouquets
											</Link>
										</li>
										<li>
											<Link
												to="/chocolates"
												className="text-muted-foreground hover:text-foreground">
												Chocolates
											</Link>
										</li>
										<li>
											<Link
												to="/gifts"
												className="text-muted-foreground hover:text-foreground">
												Gifts
											</Link>
										</li>
									</ul>
								</div>
								<div className="space-y-4">
									<h3 className="text-sm font-medium">Store</h3>
									<ul className="space-y-2 text-sm">
										<li>
											<Link
												to="#"
												className="text-muted-foreground hover:text-foreground">
												About Us
											</Link>
										</li>
										<li>
											<Link
												to="/policies"
												className="text-muted-foreground hover:text-foreground">
												Policies
											</Link>
										</li>
										<li>
											<Link
												to="#"
												className="text-muted-foreground hover:text-foreground">
												Contact Us
											</Link>
										</li>
										<li>
											<Link
												to="#"
												className="text-muted-foreground hover:text-foreground">
												FAQs
											</Link>
										</li>
									</ul>
								</div>
							</div>
							<div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
								<p>
									© {new Date().getFullYear()} House of Flowers. All rights
									reserved.
								</p>
							</div>
						</div>
					</footer>
				</div>
			)}
		</>
	);
}
