import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components";
import { useAuth } from "@/contexts";
import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/logo.png";

export function UserDrawer() {
  const { logout, user } = useAuth();

  const products = [
    "bouquets",
    "flowers",
    "chocolates",
    "gifts",
    "money-bouquets",
  ];

  const otherLinks = ["customize", "about", "contact"];

  const { pathname } = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="block   md:hidden group">
          <img className="h-5 w-5 rounded-full" src={Logo} alt="Shop Logo" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="  ">
        <div className="relative min-h-full ">
          <SheetHeader>
            <SheetTitle>
              <SheetClose asChild>
                <Link to="/">H&N - House of Flowers</Link>
              </SheetClose>
            </SheetTitle>
            <SheetDescription>
              {/* Make changes to your profile here. Click save when you're done. */}
            </SheetDescription>
          </SheetHeader>

          <div className="py-5 space-y-2">
            <SheetClose asChild className="border-b">
              <Button
                asChild
                variant={pathname === "/" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Link to="/">Home</Link>
              </Button>
            </SheetClose>
            <div className="space-y-2 border-b">
              <p className="text-xs text-zinc-600 font-medium dark:text-white/80">
                Products
              </p>
              {products.map((product) => (
                <SheetClose asChild key={`sheet-${product}`}>
                  <Button
                    asChild
                    key={`btn-${product}`}
                    variant={pathname.includes(product) ? "default" : "ghost"}
                    className="w-full justify-start capitalize"
                  >
                    <Link to={product} key={`link-${product}`}>
                      {product.replace(/-/g, " ")}
                    </Link>
                  </Button>
                </SheetClose>
              ))}
            </div>
          </div>

          <div className="space-y-2 ">
            {otherLinks.map((link) => (
              <SheetClose asChild key={`sheet-${link}`}>
                <Button
                  asChild
                  key={`btn-${link}`}
                  variant={pathname.includes(link) ? "default" : "ghost"}
                  className="w-full justify-start capitalize"
                >
                  <Link to={link} key={`link-${link}`}>
                    {link}
                  </Link>
                </Button>
              </SheetClose>
            ))}
          </div>

          <SheetFooter className="absolute   bottom-5 w-full">
            <SheetClose asChild>
              <Button variant="destructive" type="button" onClick={logout}>
                <LogOut />
                Logout
              </Button>
            </SheetClose>

            <SheetClose asChild className="">
              <Button className="justify-start   my-2 px-0 " variant="ghost">
                <Avatar className="border h-8 w-8">
                  <AvatarImage className="object-cover" src={user?.photo} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-sm">{`${user?.firstName} ${user?.lastName}`}</p>
                  <p className="text-xs text-zinc-600 dark:text-white/80">
                    {user?.email}
                  </p>
                </div>
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
