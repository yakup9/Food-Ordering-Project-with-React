import { useEffect, useState } from "react";
import Title from "../ui/Title";
import { useSession } from "next-auth/react";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const status = ["preparing", "on the way", "delivered"];
  const { data: session } = useSession();
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`
        );
        setOrders(
          res.data.filter((order) => order.customer === currentUser?.fullName)
        );
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, [currentUser]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        setCurrentUser(
          res.data.filter((user) => user.email === session.user.email)[0]
        );
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [session]);
  return (
    <div className="lg:p-8 flex-1 lg:mt-0 mt-5">
      <Title addClass="text-[40px]">Orders</Title>
      <div className="overflow-x-auto w-full mt-5">
      <table className="w-full text-sm text-center text-gray-500 xl:min-w-[1000px] min-w-100%">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
          {orders.map((order) => (
              <tr
                className="transition-all bg-secondary border-gray-700 hover:bg-primary"
                key={order?._id}
              >
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center gap-x-1 justify-center">
                  <span>{order?._id.substring(0, 5)}...</span>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                {order?.address}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                {order?.updatedAt}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                ${order?.total}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                {status[order?.status]}
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Order;