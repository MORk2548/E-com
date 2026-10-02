const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const make = (d) => (props) => <svg {...base} {...props}>{d}</svg>
export const SearchIcon = make(<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>)
export const HeartIcon = make(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>)
export const CartIcon = make(<><path d="M3 4h2l2.4 11h10.2L20 8H6.2"/><circle cx="9" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/></>)
export const UserIcon = make(<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></>)
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h16"/>)
export const CloseIcon = make(<path d="m6 6 12 12M18 6 6 18"/>)
export const LogoutIcon = make(<><path d="M9 4H5v16h4"/><path d="M16 8l4 4-4 4M20 12H9"/></>)
