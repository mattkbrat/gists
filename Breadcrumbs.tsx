"use client";

import BreadcrumbWrapper from "@/components/BreadcrumbWrapper";
import type { BreadcrumbLinkProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export const AdminBreadcrumbs = () => {
	const pathName = usePathname();

	const routeSegments = pathName?.split("/").slice(1) || [];
	routeSegments[0] = "/admin";

	const breadcrumbs: Partial<BreadcrumbLinkProps>[] = routeSegments.map(
		(r, n) => {
			const href = routeSegments.slice(0, n + 1).join("/");
			return {
				href,
				children: r.toUpperCase().replaceAll("/", ""),
				isCurrentPage: n === routeSegments.length - 1,
			};
		},
	);

	return <BreadcrumbWrapper breadcrumbs={breadcrumbs} />;
};
