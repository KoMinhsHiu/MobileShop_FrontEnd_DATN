import MainSlider from "@/component/mainSlider";
import HomeCategory from "@/component/homeCategory";
import FeaturedProducts from "@/component/featuredProducts";
import { MegaMenuAPI } from "@/const/endPoint";
import { HomeProps } from "@/utils/type";
import { getData } from "@/utils/api/fetchData/apiCall";
import { useScrollRestoration } from "@/utils/hooks";
import { GetServerSidePropsContext } from "next";
import MetaTags from "@/component/metaTags";
import { MegaMenuTransformer } from "@/utils/api/transformer/megaMenu";

export default function Home(): JSX.Element {
  useScrollRestoration();

  return (
    <>
      <MetaTags />
      <MainSlider />
      <HomeCategory />
      <FeaturedProducts />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const referer = context.req.headers.referer || null;

  if (!referer) {
    const megaMenuData = await getData(MegaMenuAPI);
    const menu = MegaMenuTransformer(megaMenuData).menuItems;
    return { props: { menu } };
  }

  return { props: { menu: [] } };
}
