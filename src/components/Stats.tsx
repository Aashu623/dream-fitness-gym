'use client'

import { useGetAllMembersQuery } from "@/redux/slice/membersApiSlice";

const Stats = () => {
    const {data:members} = useGetAllMembersQuery();
    return (
        <section className="w-full ">
            < div className="container mx-auto flex justify-around space-x-16" >
                <div className="text-center">
                    <h3 className="text-4xl font-bold">10+</h3>
                    <p className="mt-2">Trainers</p>
                </div>
                <div className="text-center">
                    <h3 className="text-4xl font-bold">{members && members.length}+</h3>
                    <p className="mt-2">Members</p>
                </div>
                <div className="text-center">
                    <h3 className="text-4xl font-bold">40+</h3>
                    <p className="mt-2">Machines</p>
                </div>
            </div >
        </section >
    );
};

export default Stats;
