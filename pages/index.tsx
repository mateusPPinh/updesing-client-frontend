import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { loadClientAppInfo, loadComponents, loadPages, receivePageBlocks } from '@app/store/api-handler';
import { UmbrielVectorProps, PageProps, ComponentsProps } from '@app/utils/shared-types';
import get from 'lodash/get';

interface SlugProps {
  createSlug: PageProps[];
  siteData: UmbrielVectorProps[];
  components: ComponentsProps[];
  appInfo?: object;
}

const RenderPages = dynamic(() => import('../renders/RenderPages'));
const RenderSlots = dynamic(() => import('../renders/RenderSlots'));
const BaseStruct = dynamic(() => import('../components/Struct/BaseStruct'));
const Seo = dynamic(() => import('@app/providers/Seo'));

const HomePage = ({ createSlug, siteData, appInfo, components }: SlugProps) => {
  console.log('Site data:', siteData);

  return (
    <Seo slugData={createSlug} favico={appInfo}>
      <BaseStruct navigation={siteData}>
        <RenderSlots siteApiData={siteData} componentsData={components} />
        <RenderPages pageDataProps={createSlug} pageblockData={siteData} />
      </BaseStruct>
    </Seo>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slugFromURL = Array.isArray(context.params?.slug) ? context.params.slug[0] : context.params?.slug || 'home';

  const pagesData = await loadPages();
  console.log('Pages data:', pagesData);

  // favicons
  const loadClientInfo = await loadClientAppInfo();
  const data = get(loadClientInfo, '[0]', []);
  const loadIcons = get(data, 'favicon', {});

  const currentPageData = pagesData.find((page: { slug: string | undefined }) => page.slug === slugFromURL);

  if (!currentPageData) {
    return { notFound: true };
  }

  const siteData = currentPageData ? await receivePageBlocks(currentPageData.id) : null;
  console.log('Site data:', siteData);

  const currentPageId = currentPageData.id;

  const pageBlockForCurrentPage = siteData.find((pageBlock: { pageId: unknown }) => pageBlock.pageId === currentPageId);
  console.log('Page block for current page:', pageBlockForCurrentPage);

  const loadSiteComponentsData = await loadComponents();
  const components = loadSiteComponentsData;
  console.log('Components data:', components);

  return {
    props: {
      createSlug: currentPageData ? [currentPageData] : [],
      siteData: pageBlockForCurrentPage ? [pageBlockForCurrentPage] : [],
      components: components || [],
      appInfo: loadIcons || {},
    },
  };
};

export default HomePage;
