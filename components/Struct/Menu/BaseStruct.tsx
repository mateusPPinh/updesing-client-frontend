import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const SideMenu = dynamic(() => import('./childrens/SideMenu'));

type MenuBaseStructProps = {
  toggleMenu: () => void;
  isMenuOpen: boolean;
  props: any;
};

export default function MenuBaseStruct({
  toggleMenu,
  isMenuOpen,
  ...props
}: MenuBaseStructProps) {
  const path = usePathname();
  return (
    <>
      <Link href={path === '/' ? 'javascript:void(0)' : '/' }>
        <Image
          src="https://pub-e9274c1f91bc4ae9a98c76f02f2938d4.r2.dev/up-logo-min%20(1).svg"
          quality="85"
          priority={true}
          width={0}
          height={0}
          alt="Logo Up Design Brasil"
          style={{ height: 'auto', width: 'auto' }}
        />
      </Link>
      <button
        onClick={toggleMenu}
        className="flex items-center hover:opacity-45 duration-300"
      >
        <p className="mr-2 text-sm text-white">MENU</p>
        <Image
          quality="85"
          priority={true}
          src="/assets/menu-icon.svg"
          width={0}
          height={0}
          style={{ height: 'auto', width: 'auto' }}
          alt="Indicador de Navegação para Menu"
        />
      </button>
      <SideMenu data={props} handleOpenMenu={toggleMenu} isOpen={isMenuOpen} />
    </>
  );
}