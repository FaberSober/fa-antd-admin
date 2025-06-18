// @flow
import { useFavicon } from 'ahooks';

type Props = {
  url: string;
};

export function Favicon({ url }: Props) {
  useFavicon(url);
  return null;
}
