export interface SubdomainItem {
  id: string;
  subdomain: string;
  url: string;
  owner: string;
  createdAt: string;
}

export const MOCK_SUBDOMAINS: SubdomainItem[] = [
  {
    id: "1",
    subdomain: "mrthien.khoai.to",
    url: "https://mrthien.khoai.to",
    owner: "Chí Thiện Nguyễn",
    createdAt: "2026-05-18",
  },
  {
    id: "2",
    subdomain: "manhcuong.khoai.to",
    url: "https://manhcuong.khoai.to",
    owner: "Mạnh Cường",
    createdAt: "2026-05-18",
  },
  {
    id: "3",
    subdomain: "thinhnguyen.khoai.to",
    url: "https://thinhnguyen.khoai.to",
    owner: "mr pham",
    createdAt: "2026-05-17",
  },
];
