import React from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useState, useEffect } from 'react';
import api from '../api';
import GroupModal from '../components/GroupModal';


const Home = () => {
    const [profileData, setProfileData] = useState(null);
    const [notificationsData, setNotificationsData] = useState(null);
    const [groupsData, setGroupsData] = useState([]);
    const [suggestedGroups, setSuggestedGroups] = useState([]);
    const [groupsDetails, setGroupsDetails] = useState([]);
    const access_token = localStorage.getItem('access_token');
    const [open, setOpen] = useState(false); // for the modal
    const [groupDetails, setGroupDetails] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                
                // Fetch user profile data
                const profileResponse = await api.get('/api/account/user/profile/', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                const profileData = await profileResponse.data;
                setProfileData(profileData);
                

                //Fetch user notifications data
                const notificationsResponse = await api.get('/api/account/notifications/', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                const notificationsData = await notificationsResponse.data;
                setNotificationsData(notificationsData);

                // Fetch user groups data
                const groupsResponse = await api.get('/api/groups/list/', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                    
                });
                const groupsData = await groupsResponse.data;
                setGroupsData(groupsData);
                

                // Fetch user recommended groups data
                const suggestedGroupsResponse = await api.get('/api/groups/recommend/', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                const suggestedGroupsData = await suggestedGroupsResponse.data;
                setSuggestedGroups(suggestedGroupsData);


                // // Fetch group details for each group
                // const fetchGroupDetails = async (groupId) => {
                   
                //     try {
                //         console.log(access_token)
                //         const response = await api.get(`/api/groups/${groupId}/`, {
                //             headers: {
                //                 Authorization: `Bearer ${access_token}`
                //             }
                //         });
                       
                        
                //         console.log(groupId)
                //         const groupDetails = await response.data;
                //         setGroupsDetails((prevDetails) => ({
                //             ...prevDetails,
                //             [groupId]: groupDetails
                //         }));
                //         // Fetch group details for each group
                //         // groupsData.forEach((group) => fetchGroupDetails(group.id));
                        
       
                //     } catch (error) {
                //         console.error('Error fetching group details:', error);
                //     }
                // };

                 
             } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();

    }, [access_token]);

  if (profileData === null || notificationsData === null) {
    return <p>Loading...</p>;
  }

  const handleGroupClick = async (e, groupId) => {
    try {
        // Check if group details exist in groupsDetails
        let groupDetails = groupsDetails[groupId];

        // If group details are not yet fetched, fetch them
        if (!groupDetails) {
            const response = await api.get(`/api/groups/${groupId}/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            groupDetails = response.data;
            // Update groupsDetails state with the fetched group details
            setGroupsDetails(prevDetails => ({
                ...prevDetails,
                [groupId]: groupDetails
            }));
        }
        
        // Open modal with group details
        setOpen(true);
        setGroupDetails(groupDetails);
    } catch (error) {
        console.error('Error handling group click:', error);
    }
}

const handleRequestMembership = async (groupId) => {
    try {
      await api.post(`/api/groups/membership/request/${groupId}/`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
    } catch (error) {
      console.error('Error requesting membership:', error);
    }
  };






    

    return (
        <>
            {/* <GroupModal isOpen={open} setOpen={setOpen} children={children} /> Modal location */}
            <GroupModal isOpen={open} setOpen={setOpen} groupDetails={groupDetails} />

            <div className='px-24 pt-10 pb-10 bg-gray-100 grid grid-rows-4 grid-flow-col gap-4 h-screen'>
                
                <div className='row-span-1 bg-gray-500 rounded-xl p-4'>
                    <p className='text-white'>Profile</p>
                    <p className='text-white'>Firstname: {profileData.firstname}</p>
                    <p className='text-white'>Lastname: {profileData.lastname}</p>
                    <p className='text-white'>Email: {profileData.email}</p>
                    <p className='text-white'>Major: {profileData.major}</p>
                    <p className='text-white'>Number: {profileData.mobile_number}</p>
                    {/* <p className='text-white'>Interests: {profileData.interests}</p> */}
                </div>

                <div className='row-span-3 col-span-1 bg-gray-500 rounded-xl p-4 overflow-y-auto'>
    <p className='text-white'>Notifications</p>
    <div className="notifications-list">
        {notificationsData.map(notification => (
            <div key={notification.id} className="notification-item">
                {notification.message}
            </div>
        ))}
    </div>
</div>



                <div className='row-span-3 col-span-2 bg-gray-700 rounded-xl p-4 '>
    {/* <p className='text-white pb-1 text-xl font-bold'>Current Groups</p> */}

    <div className='row-span-3 col-span-2 bg-gray-700 rounded-xl p-4' style={{ overflowY: 'scroll' }}>
    <p className='text-white pb-1 text-xl font-bold'>Current Groups</p>

    {/* list code */}{/* Groups display */}
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
        {groupsData.map(group => (
        <li key={group.id} className='py-2 sm:py-4' onClick={(e) => handleGroupClick(e, group.id)}>
            <div className='flex items-center space-x-2'>
                <div className='shrink-0 px-4'>
                    <div className='rounded-full bg-gray-400 w-16 h-16'>
                        <img src={group.group_image} alt="" />
                    </div>
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='text-xl font-medium text-gray-900 dark:text-white'>{group.name}</p>
                    <span className='text-md font-medium text-green-600 dark:text-white'>{group.creator}</span>
                    <span className='text-md font-medium text-gray-400 dark:text-white'>| {group.major}</span>
                </div>
            </div>
    </li>
))}

    </ul>
</div>

</div>

                {/* suggested groups */}
            {/* Render suggested groups */}
            <div className='row-span-1 col-span-3 bg-gray-900 rounded-xl p-4' style={{ overflowX: 'auto' }}>
    <p className='text-white pb-2 text-xl font-bold overflow-x-auto'>Suggested Groups</p>
    <div className='flex items-center space-x-4 bg-white rounded-md max-w-28'>
        {suggestedGroups.map((group, index) => (
            <div key={index} className='p-2 relative'>
                <p className='text-xl font-small text-gray-900 dark:text-white'>{group.name}</p>
                <p className='text-md font-small text-gray-400 dark:text-white'>{group.major}</p>
                <button 
                className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-400 w-8 h-8'
                onClick={() => handleRequestMembership(group.id)}
            >
                <PersonAddAlt1Icon />
            </button>
            </div>
        ))}
    </div>
</div>


                {/* quote of the day */}

                <div className='row-span-3 bg-gray-900 rounded-xl p-4'>
                    <p className='text-white text-xl font-bold'>Quote of the day</p>
                    <p className='text-white pt-4 max-w-64'>To whom much is given, much is expected</p>
                </div>

                

            </div>

        </>

    )
};

export default Home;
