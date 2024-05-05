import React from 'react';

import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef(null);

    const getpasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setpasswordArray((passwords))
        console.log(passwords)
    }

    useEffect(() => {
        getpasswords()

    }, []);

    const copytext = (text) => {
        toast('copied to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const savepassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newPassword = { ...form, id: uuidv4() }; // Generate UUID once
            setpasswordArray([...passwordArray, newPassword]);
            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPassword) // Use the same UUID here
            });
            setform({ site: '', username: '', password: '' });
            toast('Password Saved', { theme: "dark" });
        } else {
            toast('Password not saved', { theme: "dark" });
        }
    }
    const deletepassword = async (id) => {
        console.log("deleting password with id ", id);
        setpasswordArray(passwordArray.filter(item => item.id !== id));
        let res = await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
        toast('Password Deleted', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }


    const editpassword = (id) => {
        toast('Password Edited', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    
        const passwordToEdit = passwordArray.find(item => item.id === id);
        if (passwordToEdit) {
            // Remove the password from the list temporarily for editing
            const updatedPasswords = passwordArray.filter(item => item.id !== id);
            setform({ ...passwordToEdit }); // Set the form with the selected password data
            setpasswordArray(updatedPasswords); // Update the password list without the edited password
        }
    }
    
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <><ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition="Bounce" /><ToastContainer /><div className="p-2 md:p-0 md:mycontainer">
                <h1 className="text-4xl font-bold text-center">
                    <span className="text-green-700">&lt;</span>
                    pass<span className="text-green-700">OP/ &gt;</span>
                </h1>
                <p className="text-green-900 text-lg text-center">Your Own Password Manager</p>
                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input value={form.site} name="site" onChange={handleChange} className="rounded-full border border-green-500 w-full p-4 py-1" type="text" placeholder="Enter Site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-4">
                    <input 
        value={form.username} 
        name="username" 
        onChange={handleChange} 
        className="rounded-full border border-green-500 w-1/2 p-4 py-1" 
        type="text" 
        placeholder="Enter Username" 
    />
                        <input value={form.password} name="password" onChange={handleChange} className="rounded-full border border-green-500 w-1/2 p-4 py-1" type={showPassword ? "text" : "password"} placeholder="Enter password" />
                        <span className="absolute right-[3px] top-[4px] cursor-pointer" onClick={togglePasswordVisibility}>
                        </span>
                    </div>

                    <button onClick={savepassword} className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 rounded-full px-4 py-2 w-fit">
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" />
                        Add Password</button>
                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No Passwords to Show </div>}
                    {passwordArray.length != 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>username</th>
                                    <th className='py-2'>password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className='  justify-center  py-2 border border-white text-center'>
                                            <div className="flex items-center">
                                                <a href="{item.site}" target='_blank'>
                                                    <span>{item.site}</span></a>
                                                <div className="size-7 cursor-pointer" onClick={() => { copytext(item.site); }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">

                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='justify-center py-2 border border-white text-center'>
                                            <div className="flex items-center "><span>{item.username}</span>
                                                <div className="size-7 cursor-pointer" onClick={() => { copytext(item.username); }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">

                                                    </lord-icon>
                                                </div>
                                            </div></td>
                                        <td className=' justify-center py-2 border border-white text-center'>
                                            <div className="flex items-center justify-center"><span>{"*".repeat(item.password.length)}</span>
                                                <div className="size-7 cursor-pointer" onClick={() => { copytext(item.password); }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">

                                                    </lord-icon>
                                                </div>
                                            </div></td>
                                        <td className=' justify-center py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => { editpassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletepassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>}
                </div>
            </div></>
    );
};

export default Manager;
