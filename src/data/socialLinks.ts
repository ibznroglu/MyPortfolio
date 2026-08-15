import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { settings } from '../helpers/functions/settings';

// Single source of truth: the desktop rail and the mobile footer both render this.
export const socialLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: settings.linkedin,
    Icon: FaLinkedin,
    external: true,
    railClass: 'bg-blue-600 hover:shadow-blue-600/50',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: settings.github,
    Icon: FaGithub,
    external: true,
    railClass: 'bg-[#333333] hover:shadow-gray-800/50',
  },
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${settings.email}`,
    Icon: HiOutlineMail,
    external: false,
    railClass: 'bg-accent hover:shadow-accent/50',
  },
];
