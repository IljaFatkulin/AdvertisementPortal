import Modal from 'react-modal';
import styles from './../ChangeModal/ChangeModal.module.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import AccountService from '../../api/AccountService';
import { UserDetailsContext } from '../../context/UserDetails';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles2 from './../Navbar/Navbar.module.css';


export const AdminUsers = ({isOpen, closeModal}) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const { userDetails } = useContext(UserDetailsContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        AccountService.getAll(userDetails)
            .then(response => {
                console.log(response.data)
                setUsers(response.data)
            }).catch((error) => {
                console.log(error)
            })
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        const role = user.roles && user.roles.length > 0 ? (user.roles[0].name).replace('ROLE_', '') : "No role";
        setRole(role)
        setBanned(user.locked === true ? "Yes" : "No")
    }

    const renderUsers = () => {
        if (!users || users.length === 0) {
            return null;
        }
        return users.map((user, index) => {
            return (
                <div style={selectedUser?.id === user.id ?  {display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "100px", border: "2px solid black", borderRadius: "15px", paddingInline: "10px", marginBottom: "20px", border:"4px solid blue"} : {display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "100px", border: "2px solid black", borderRadius: "15px", paddingInline: "10px", marginBottom: "20px"}} key={index}>
                    <p>{user.email}</p>
                    <button onClick={() => handleSelectUser(user)}>View</button>
                </div>
            )
        })
    }

    const handleProfileClick = (email) => {
        // navigate(`/profile/${email}`)
        window.location.href = `/profile/${email}`
        closeModal()
    }

    const [role, setRole] = useState(null);
    const [banned, setBanned] = useState("No");

    const handleSave = () => {
        AccountService.updateUser(userDetails, selectedUser.id, role, banned)
            .then(r => {
                console.log(r)
            }).catch(err => {
                console.log(err)
            })
    }

    const renderSelectedUser = () => {
        if (!selectedUser) {
            return null
        }

        return (
            <div style={{display:"flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%"}}>
                <div>
                    <p>ID: {selectedUser.id}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Role:
                        <select style={{marginLeft: "10px"}} value={role} onChange={(e) => setRole(e.target.value)} className={styles2.selectLang}>
                            <option value='USER'>User</option>
                            <option value='ADMIN'>Admin</option>
                        </select>
                    </p>
                    <p>Banned:
                    <select style={{marginLeft: "10px"}} value={banned} onChange={(e) => setBanned(e.target.value)} className={styles2.selectLang}>
                            <option value='Yes'>Yes</option>
                            <option value='No'>No</option>
                        </select>
                    </p>
                    <button onClick={handleSave}>Save</button>
                    <button style={{backgroundColor: "transparent", marginLeft: "10px", border: "2px solid blue", color: "black"}} onClick={() => handleProfileClick(selectedUser.email)}>Profile</button>
                </div>
            </div>
        )
    }

    return (
        <Modal
        className={styles.changeModal3}
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel={t('Change')}
    >
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{ width: "50%", borderRight: "2px solid black", paddingRight: "30px"}}>
                { renderUsers() }
            </div>

            <div style={{ width: "50%",}}>
                { renderSelectedUser() }
            </div>
        </div>
    </Modal>
    )
}

export default AdminUsers;