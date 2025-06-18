import qs from 'qs';

export default function useQs() {
  const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  return parsed;
}
