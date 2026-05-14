"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

if (pathname.startsWith("/y/")) {
  return null;
}

if (pathname.startsWith("/my/")) {
  return null;
}

if (pathname.startsWith("/login")) {
  return null;
}

  return (
    <div style={styles.nav}>
      <NavItem href="/" label="Home" active={pathname === "/"} />
      <NavItem href="/collection" label="Collection" active={pathname === "/collection"} />
      <NavItem href="/profile" label="Profile" active={pathname === "/profile"} />
    </div>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} style={{
      ...styles.item,
      opacity: active ? 1 : 0.5,
    }}>
      {label}
    </Link>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: "60px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  item: {
    textDecoration: "none",
    color: "#000",
    fontSize: "14px",
  },
};