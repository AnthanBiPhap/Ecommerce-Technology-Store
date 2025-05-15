import Link from "next/link";

interface BreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  productName?: string;
}

export default function Breadcrumb({
  categoryName,
  categorySlug,
  productName,
}: BreadcrumbProps) {
  return (
    <div className="text-sm text-gray-600 mb-4">
      <div className="flex space-x-2 items-center">
        <Link href="/" className="hover:underline text-blue-500">
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          href={`/${categorySlug}`}
          className="hover:underline text-blue-500"
        >
          {categoryName}
        </Link>
        {productName && (
          <>
            <span>/</span>
            <span className="text-gray-900 font-medium">{productName}</span>
          </>
        )}
      </div>
    </div>
  );
}
