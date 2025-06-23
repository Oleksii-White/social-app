import { useCurrentQuery } from '@/app/services/userApi'
import {Spinner} from "@heroui/spinner";

export const AuthGuard = ({
    children
}: { children: JSX.Element}) => {
    const { isLoading } = useCurrentQuery();

    if (isLoading) {
        return <Spinner />
    }
  return children
}