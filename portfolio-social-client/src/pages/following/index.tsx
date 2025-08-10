import { User } from "@/components/user";
import { selectCurrent } from "@/features/user/userSlice"
import { Card, CardBody } from "@heroui/card";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";

export const Following = () => {
  const currentUser = useSelector(selectCurrent);

  if (!currentUser) {
    return null
  }

  return currentUser.following.length > 0 ? (
    <div className="gap-5 flex flex-col">
      {
        currentUser.following.map(user => (
          <Link to={`/users/${user.following.id}`} key={user.following.id}>
            <Card>
              <CardBody className="block">
                <User
                  name={user.following.name ?? ""}
                  avatarUrl={user.following.avatarUrl ?? ""}
                  description={user.following.email ?? ""}
                />
              </CardBody>
            </Card>
          </Link>
        ))
      }
    </div>
  ) : (
    <h1>Start connecting! Follow people and get discovered.
</h1>
  )

}
