"use client";

import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ProductManager } from "../components/product/ProductManager";

export const ProductPage = () => (
  <PageContainer title="Manajemen Produk" withHeader>
    <SectionContainer padded>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            Manajemen Produk
          </CardTitle>
          <CardDescription>
            Kelola menu, harga, dan ketersediaan produk yang tampil di kasir.
          </CardDescription>
        </CardHeader>

        {/* ProductManager renders CardContent + action toolbar + table + modals */}
        <ProductManager />
      </Card>
    </SectionContainer>
  </PageContainer>
);
