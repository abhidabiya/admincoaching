import { Typography } from "@mui/material";
import { API_URL, APP_PREFIX_PATH } from "config/constant";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import JoditEditor from 'jodit-react'
import { useEffect, useState,useMemo, useRef } from "react";
import axios from "axios";

function AddNewWing() {
    
    const [wing, setWing] = useState('')
    const [societyname, setSocietyname] = useState('');
    const [wingtype, setwingtype] = useState('');
    
    const [societyadd, setSocietyadd] = useState('');
    
    const [number, setNumber] = useState('')
    const [emailadd, setEmailadd] = useState('')
    
    const [guardName, setguardName] = useState('')
    const [phoneNumber, setphoneNumber] = useState('')
    const [addAddress, setaddAddress] = useState('')
    const [password, setPassword] = useState('')
    const [society, setSociety] = useState('')
    
    const [timing, setTiming] = useState('')
    
    const [cityDetails, setcityDetails] = useState([])
    const [startCityId, setStartCityId] = useState('')
    const [endCityId, setEndCityId] = useState('')
    const [addTripError, setaddTripError] = useState('')
    const [addTripName, setAddTripName] = useState('')
    const [addJoinAmount, setAddJoinAmount] = useState('')
    const [addCommission, setAddCommission] = useState('')
    const [addStartDate, setAddStartDate] = useState('')
    const [addEndDate, setAddEndDate] = useState('')
    const [addStartTime, setAddStartTime] = useState('')
    const [addDistance, setAddDistance] = useState('')
    const [addBudget, setAddBudget] = useState('')
    const [addDuration, setAddDuration] = useState('')
    const [addStartAddress, setAddStartAddress] = useState('')
    const [addEndAddress, setAddEndAddress] = useState('')
    const [addAboutTrip, setAddAboutTrip] = useState('')
    const [showModal, setShowModal] = useState(false)
    // const [addImage, setAddImage] = useState('')
    const [images, setImages] = useState([]);
    const [addCondition, setAddCondition] = useState('')
    const navigate = useNavigate();
    const editor = useRef(null)

    const fetchAllCity = () => {
        axios
            .get(`${API_URL}get_all_city`)
            .then((response) => {
                setcityDetails(response.data.city_array);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }
    useEffect(() => {
        fetchAllCity()
    }, []);

    const handleCloseModal = () => {
        setShowModal(false)
        navigate(APP_PREFIX_PATH + '/managetrips')
    }

    const config1 = useMemo(() => ({
        readonly: false,
        placeholder: 'Enter riding condition',
        defaultActionOnPaste: 'insert_as_html',
        buttons: [
            'bold', 'italic', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', '|',
            'outdent', 'indent', 'align', '|',
            'hr', '|', 'fullsize', 'brush', '|',
            'table', 'link', '|',
            'undo', 'redo'
        ],
        statusbar: false,
        toolbarAdaptive: false
    }), []);

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setImages((prev) => [...prev, ...files]);
        setaddTripError((prev) => ({ ...prev, images: '' }));
    };

    //add trip
    const addNewTrip = async (e) => {
        e.preventDefault()
        let errors = {}
        if (!startCityId) {
            errors.startCityId = 'Please select city'
        }
        if (!endCityId) {
            errors.endCityId = 'Please select city'
        }
        if (!societyname) {
            errors.addTripName = 'Please enter society name'
        }
        if (!societyadd) {
            errors.addJoinAmount = 'Please enter wing'
        }
        if (!wingtype) {
            errors.addCommission = 'Please enter wing type'
        }
        if (!addStartDate) {
            errors.addStartDate = 'Please enter start date'
        }
        if (!addEndDate) {
            errors.addEndDate = 'Please enter date'
        }
        if (!addStartTime) {
            errors.addStartTime = 'Please enter time'
        }
        if (!emailadd) {
            errors.addDistance = 'Please enter email'
        }
        if (!addDuration) {
            errors.addDuration = 'Please enter duration'
        }
        if (!wing) {
            errors.addStartAddress = 'Please enter wing name'
        }
        if (!addEndAddress) {
            errors.addEndAddress = 'Please enter address'
        }
        if (!addAboutTrip) {
            errors.addAboutTrip = 'Please enter description'
        }
        if (!addCondition) {
            errors.addCondition = 'Please enter riding condition'
        }
        if (!number) {
            errors.addBudget = 'Please enter number'
        }
       

        console.log("riding condition", addCondition);
        console.log("error", addTripError);


        if (Object.keys(errors).length > 0) {
            setaddTripError(errors)
            return
        }

        setaddTripError({})

        // let trip_data = {
        //     ride_name: addTripName,
        //     rider_commision_percentage: addCommission,
        //     join_amount: addJoinAmount,
        //     duration: addDuration,
        //     distance: addDistance,
        //     start_time: addStartTime,
        //     end_date: addEndDate,
        //     start_date: addStartDate,
        //     start_city: startCityId,
        //     end_city: endCityId,
        //     start_address: addStartAddress,
        //     end_address: addEndAddress,
        //     about_trip: addAboutTrip,
        //     riding_condition: addCondition,
        //     ride_image: addImage,
        //     budget: addBudget
        // }

        const data = new FormData()
        data.append('ride_name', addTripName)
        data.append('rider_commision_percentage', addCommission)
        data.append('join_amount', addJoinAmount)
        data.append('duration', addDuration)
        data.append('distance', addDistance)
        data.append('start_time', addStartTime)
        data.append('end_date', addEndDate)
        data.append('start_date', addStartDate)
        data.append('end_city', endCityId)
        data.append('start_city', startCityId)
        data.append('start_address', addStartAddress)
        data.append('end_address', addEndAddress)
        data.append('about_trip', addAboutTrip)
        data.append('riding_condition', addCondition)
        // data.append('image', addImage)
        images.forEach((image) => data.append('image', image)); 
        data.append('budget', addBudget)

        axios.post(`${API_URL}add_new_trip`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                if (response.data.key) {
                    setaddTripError({ general: response.data.message })
                }
                else if (response.data.success) {
                    setaddTripError('')
                    setAddDistance('')
                    setAddStartTime('')
                    setAddEndDate('')
                    setAddStartDate('')
                    setAddCommission('')
                    setAddJoinAmount('')
                    setAddTripName('')
                    setAddAboutTrip('')
                    setAddCondition('')
                    setAddEndAddress('')
                    setAddStartAddress('')
                    setAddDuration('')
                    setEndCityId('')
                    setStartCityId('')
                    setAddBudget('')
                    setShowModal(true)
                }
            })
            .catch((error) => {
                console.error('Error adding new job', error)
            })
    }
   
    return (
        <>

    <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p
                    style={{
                        // margin: '2px',
                        fontSize: '1.25rem',
                        color: '#121926',
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        lineHeight: '1.167',
                        // fontWeight: ' 500',
                        marginBottom: ' 5px'
                    }}
                >
                    Manage Wing / Add Wing
                </p>
            </div>
             <Card>
                <Card.Header className=" bg-white ">
                    <div className='text-center fs-5 mb-3'>Add New Wing</div>
                    <div>
                        <Form onSubmit={addNewTrip}>
                            <div className='row m-2'>
                               



                                <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                    Wing Name
                                    </label>
                                    <Form.Control type="text"
                                        placeholder='Enter society wing'
                                        onChange={(e) => {
                                            setWing(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addJoinAmount: '' }));
                                        }}
                                        isInvalid={addTripError.addJoinAmount}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addJoinAmount}
                                    </Form.Control.Feedback>
                                </div>

                                <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                         Society Name
                                    </label>
                                    <Form.Control type="text" placeholder='Enter society name' onChange={(e) => {
                                        setSocietyname(e.target.value)
                                        setaddTripError((prev) => ({ ...prev, addTripName: '' }));
                                    }}
                                        isInvalid={addTripError.addTripName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addTripName}
                                    </Form.Control.Feedback>
                                </div>
                            </div>

                            <div className='row m-2'>
                                <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                    Wing Type
                                    </label>
                                    <Form.Control type="text" placeholder='Enter wing type'
                                        onChange={(e) => {
                                            setwingtype(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addCommission: '' }));
                                        }}
                                        isInvalid={addTripError.addCommission}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addCommission}
                                    </Form.Control.Feedback>
                                </div>

                                <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                    Contact Number
                                    </label>
                                    <Form.Control type="text" placeholder='Enter number' onChange={(e) => {
                                        setNumber(e.target.value)
                                        setaddTripError((prev) => ({ ...prev, addBudget: '' }));
                                    }}
                                        isInvalid={addTripError.addBudget}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addBudget}
                                    </Form.Control.Feedback>
                                </div>
                            </div>
                            {/* --------------------------------------------- */}
                         

                            <div className='row m-2'>
                                {/* <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                    Email Address
                                    </label>
                                    <Form.Control type="text"
                                        placeholder='Enter Society Name '
                                        onChange={(e) => {
                                            setEmailadd(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addDistance: '' }));
                                        }}
                                        isInvalid={addTripError.addDistance}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addDistance}
                                    </Form.Control.Feedback>
                                </div> */}

                                {/* <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                    Wing Name
                                    </label>
                                    <Form.Control type="text"
                                        placeholder='Enter Wing Name'
                                        onChange={(e) => {
                                            setAddStartAddress(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addStartAddress: '' }));
                                        }}
                                        isInvalid={addTripError.addStartAddress}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addStartAddress}
                                    </Form.Control.Feedback>
                                </div> */}

                              
                            </div>

                            <div className='row m-2'>
                                {/* <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                        Work Timing
                                    </label>
                                    <Form.Control type="text"
                                        placeholder='Enter  Work Timing'
                                        onChange={(e) => {
                                            setWing(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addDistance: '' }));
                                        }}
                                        isInvalid={addTripError.addDistance}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addDistance}
                                    </Form.Control.Feedback>
                                </div> */}

                                {/* <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                      Role
                                    </label>
                                    <Form.Control type="text"
                                        placeholder='Enter Role'
                                        onChange={(e) => {
                                            setAddStartAddress(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addStartAddress: '' }));
                                        }}
                                        isInvalid={addTripError.addStartAddress}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addStartAddress}
                                    </Form.Control.Feedback>
                                </div> */}

                                
{/* **************************************** */}
                              
                            </div>

                            {/* <div className='row m-2'>
                               

                                <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                        Ending Point
                                    </label>
                                    <Form.Control type="text" placeholder='Enter Ending point' onChange={(e) => {
                                        setAddEndAddress(e.target.value)
                                        setaddTripError((prev) => ({ ...prev, addEndAddress: '' }));
                                    }}
                                        isInvalid={addTripError.addEndAddress}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addEndAddress}
                                    </Form.Control.Feedback>
                                </div>
                            </div> */}

                            <div className='row m-2'>
                                {/* <div className='col-md-6'>
                                    <label htmlFor="clientSelect" className="form-label">
                                        Starting City
                                    </label>
                                    <Form.Select
                                        id="clientSelect"
                                        placeholder="Select client"
                                        onChange={(e) => {
                                            const selectedCityId = e.target.value;
                                            setStartCityId(selectedCityId);
                                            setaddTripError((prev) => ({ ...prev, startCityId: '' })); // Clear error state if any
                                        }}

                                        isInvalid={addTripError.startCityId}
                                    >

                                        <option value="" >
                                            Select City
                                        </option>
                                        {cityDetails.map((city) => (
                                            <option key={city.city_id} value={city.city_id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.startCityId}
                                    </Form.Control.Feedback>
                                </div> */}
                                {/* <div className='col-md-6'>
                                    <label htmlFor="clientSelect" className="form-label">
                                        Ending City
                                    </label>
                                    <Form.Select
                                        id="clientSelect"
                                        placeholder="Select city"
                                        onChange={(e) => {
                                            const selectedCityId = e.target.value;
                                            setEndCityId(selectedCityId);
                                            setaddTripError((prev) => ({ ...prev, endCityId: '' }));
                                        }}

                                        isInvalid={addTripError.endCityId}
                                    >

                                        <option value="" >
                                            Select City
                                        </option>
                                        {cityDetails.map((city) => (
                                            <option key={city.city_id} value={city.city_id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.endCityId}
                                    </Form.Control.Feedback>
                                </div> */}
                            </div>

                            {/* <div className='row m-2'>
                            <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                        Trip Duration
                                    </label>
                                    <Form.Control type="text" placeholder='Enter duration' onChange={(e) => {
                                        setAddDuration(e.target.value)
                                        setaddTripError((prev) => ({ ...prev, addDuration: '' }));
                                    }}
                                        isInvalid={addTripError.addDuration}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addDuration}
                                    </Form.Control.Feedback>
                                </div>
                            <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                        Description
                                    </label>
                                    <Form.Control as="textarea" type="text"
                                        placeholder='Enter description'
                                        onChange={(e) => {
                                            setAddAboutTrip(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addAboutTrip: '' }));
                                        }}
                                        isInvalid={addTripError.addAboutTrip}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addAboutTrip}
                                    </Form.Control.Feedback>
                                </div>
                              
                            </div> */}

                            <div className='row m-2'>

                            {/* <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                    Riding Condition
                                    </label>
                                    <Form.Control type="text" as="textarea" placeholder='Enter riding condition' onChange={(e) => {
                                        setAddCondition(e.target.value)
                                        setaddTripError((prev) => ({ ...prev, addCondition: '' }));
                                    }}
                                        isInvalid={addTripError.addCondition}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addCondition}
                                    </Form.Control.Feedback>
                                </div> */}


                                {/* <div className='col-md-6'>
                                    <label htmlFor="ridingCondition" className="form-label">
                                        Riding Condition
                                    </label>
                                    <JoditEditor
                                        value={addCondition}
                                        config={config1}
                                        // onChange={(content) => { handleInputChange('about us', content); setEmptyContent(''); }}
                                        onChange={(newContent) => {
                                            setAddCondition(newContent);
                                            setaddTripError((prev) => ({ ...prev, addCondition: '' }));
                                        }}
                                    />
                                    
                                    {addTripError.addCondition && (
                                        <span className="text-danger">{addTripError.addCondition}</span>
                                    )}
                                </div> */}


                               {/* image starts  */}

                                {/* <div className='col-md-6'>
                                    <label htmlFor="categoryDescription" className="form-label">
                                        Image
                                    </label>
                                    <Form.Control type="file"
                                        placeholder='Enter Image'
                                        onChange={(e) => {
                                            setAddImage(e.target.value)
                                            setaddTripError((prev) => ({ ...prev, addImage: '' }));
                                        }}
                                        isInvalid={addTripError.addImage}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addTripError.addImage}
                                    </Form.Control.Feedback>
                                </div> */}
                                {/* ===================== */}

                                {/* <div className="col-md-6">
                                    <label>Images</label>
                                    <input
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="form-control"
                                    />
                                    <div className="image-preview mt-2">
                                        {images.map((image, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'inline-block',
                                                    margin: '10px',
                                                    position: 'relative'
                                                }}
                                            >
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index}`}
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-15px',
                                                        borderRadius:'50%',
                                                        width:'25px',
                                                        height:'30px'
                                                    }}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                  <span style={{fontSize:'170%' ,  position: 'absolute', top: '-2px',
                                                        right: '7px'}}> &times;</span> 
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {addTripError.images && <div className="text-danger">{addTripError.images}</div>}

                                </div> */}



                            </div>


                            {addTripError.general && <span className="text-danger">{addTripError.general}</span>}
                            <div className='text-start m-3'>
                                <Button variant="primary" type='submit'>
                                    Save
                                </Button></div>
                        </Form>
                    </div>
                </Card.Header>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Created</Modal.Title>
                </Modal.Header>
                <Modal.Body>New Trip Created Successfully</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Okay
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddNewWing;