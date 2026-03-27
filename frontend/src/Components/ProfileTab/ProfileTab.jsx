import { useState, useEffect } from "react";
import { getUserDetails,updateFirstName, updateLastName} from "../../Actions/UserActions";
import ProfileField from "./ProfileFIeld";
import MovieList from '../MovieList/MovieList/MovieList'
import defaultpp from "../../assets/default-pp.webp"
import {getUserLogsMovieList} from '../../Actions/UserMovieActions'


export default function ProfileTab() {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicturePath: ""
  });
  const [movieList, setmovieList] = useState([]);
  useEffect(() => {
    const fetchDetails = async () => {
      const user = await getUserDetails();
      setUserDetails(user);
        
    };
    const fetchMovies = async () => {
            const movies = await getUserLogsMovieList();
            setmovieList(movies);
        };
    fetchMovies();
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

const handleSave = async (fieldName) => {
    try {
      if (fieldName === "firstName") {
        await updateFirstName(userDetails.firstName);
      } else if (fieldName === "lastName") {
        await updateLastName(userDetails.lastName);
     }
      alert(`${fieldName} updated successfully!`);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-10 gap-8 h-screen">
       
      <img 
        alt="Profile" 
        src={!userDetails.profilePicturePath?defaultpp: userDetails.profilePicturePath }
        className="size-32 rounded-full object-cover shadow-md ring-2 ring-slate-100" 
      />

      <div className="flex flex-col gap-6 w-full items-center">
        <ProfileField 
          label="First Name"
          name="firstName"
          value={userDetails.firstName}
          onChange={handleChange}
          onSave={handleSave}
        />

        <ProfileField 
          label="Last Name"
          name="lastName"
          value={userDetails.lastName}
          onChange={handleChange}
          onSave={handleSave}
        />

        <ProfileField 
          label="Email Address"
          name="email"
          value={userDetails.email}
          readOnly={true} 
        />
      </div>
      <MovieList Movies={movieList} />
    </div>
  );
}