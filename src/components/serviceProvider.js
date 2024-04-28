import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Select from "react-select"

export default function ServiceProviderForm() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        mobile: '',
        serviceType: [''],
        categories: [],
        socialLinks: '',
        location: '',
        name: '',
        amount: ''
    })

    const errors = {}

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            mobile : form.mobile,
            serviceType : form.serviceType,
            // name : form.categories.name,
            // amount : form.categories.amount,
            categories:[{name:form.categories[0].name , amount:Number(form.categories[1].amount)}],
            socialLinks : form.socialLinks,
            location : form.location
        }

        if (Object.keys(errors).length === 0) {
            console.log('formdata' , formData)
            try {
                const response = await axios.post('http://localhost:3060/api/serviceProvider', formData, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(response.data)
                navigate('/gallery')
            } catch (err) {
                console.log(err)
            }
        } else {
            setForm({ ...form })
        }
    }


    const serviceTypeOptions = [
        { value: 'photography', label: 'Photography' },
        { value: 'videography', label: 'Videography' }
    ];

    const handleServiceType = (selectedOptions) => {
        console.log(selectedOptions)
        const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        setForm({ ...form, serviceType: values });
    };

    const nameOptions = [
        { value: 'wedding', label: 'Wedding' },
        { value: 'babyphots', label: 'Baby Photos' },
        { value: 'events', label: 'Events' },
        { value: 'nature', label: 'Nature' },
        { value: 'travel', label: 'Travel' },
        { value: 'drone', label: 'Drone' }
    ];

    // const handleCategoriesChange = (index, selectedOption) => {
    //     console.log(selectedOption)
    //     // console.log(index , selectedOption)
    //     // const updatedCategories = [...form.categories];
    //     // updatedCategories[index].name = selectedOption.value;
    //     // setForm({ ...form, categories: updatedCategories });
    //     setForm({...form, name: selectedOption.value})
    // };

    // const handleAmountChange = async(e) => {
    //     // const updatedCategories = [...form.categories];
    //     // updatedCategories[index].amount = amount.map(option => option.value);
    //     // setForm({ ...form, categories: updatedCategories });
    //     // setForm(prevForm => ({
    //     //     ...prevForm,
    //     //     categories: prevForm.categories.map((category, index) => {
    //     //       if (index === 1) {
    //     //         return {
    //     //           ...category,
    //     //           amount: e.target.value
    //     //         };
    //     //       }
    //     //       return category;
    //     //     })
    //     //   }));

    //     setForm({...form, amount: e.target.value })
        
    // };

    const addCategory = () => {
        // setForm({ ...form, categories: [...form.categories, { name: '', amount: null }] });
        const categoryObj = {
            tempId: Number(new Date()),
            name: form.name, 
            amount: form.amount 
        }
        setForm({...form, categories: [...form.categories, categoryObj], name: '', amount: ''})
    };

    const handleRemoveCategory =(tempId) => {
        setForm({...form, categories: form.categories.filter(ele => ele.tempId !== tempId)})
    }

    const handleChange = async(e)=>{
        const {value, name} = e.target
        setForm({...form, [name]:value})
    }

    const handleSelectedCategoryChange = (e) =>{
        console.dir(e.target)
        const {name,value, id } = e.target
        console.log(name, value, id)
        setForm({...form, categories: form.categories.map((ele) => {
            if(ele.tempId === id) {
                return {...ele, [name]: value}
            } else {
                return {...ele}
            }
        })})
    }

    return (
        <div className="form-group">
            <h3>Service Provider Form</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mobile">Add Mobile Number</label><br />
                <input
                    type="text"
                    value={form.mobile}
                    onChange={handleChange}
                    name="mobile"
                    id="mobile"
                    className="form-control"
                />
                <br />

                <label htmlFor="serviceType">Service Type</label><br />
                <Select
                    value={serviceTypeOptions.filter((option) => form.serviceType.includes(option.value))}
                    options={serviceTypeOptions}
                    isMulti
                    onChange={handleServiceType}
                    className="form-control"
                />
                <br />

                <label htmlFor='categories'>Categories</label><br />
                { form.categories.map((category, index) => {
                   return (
                    <div>
                        <select value={category.name} onChange={handleSelectedCategoryChange} name="name" id={category.tempId}>
                            {nameOptions.map((ele) => {
                                return <option value={ele.value}>{ ele.label }</option>
                            })}
                        </select>
                        <input type="text" value={category.amount} onChange={handleSelectedCategoryChange} name="amount" id={category.tempId} />
                        <button onClick={() => {
                            handleRemoveCategory(category.tempId )
                        }} >remove</button>
                    </div>
                   )
                })}
                {/* {form.categories.map((category, index) => (
                    <div key={index}>
                        <Select
                            value={form.name}
                            options={nameOptions}
                            onChange={(selectedOption) => handleCategoriesChange(index, selectedOption)}
                        />
                        <input
                            type="text"
                            value={form.amount}
                            onChange={handleAmountChange}
                            name="categories"
                            id="categories"
                            className="form-control"
                        />
                        <br/>
                        {index > 0 && <button type="button" onClick={() => removeCategory(index)}>Remove</button>}
                    </div>
                ))}
                <br/>
                
                <br /> */}

                <select value={form.name} onChange={(e) => { setForm({...form, name: e.target.value })}}>
                    <option value="">select</option>
                    { nameOptions.map((ele) => {
                        return <option value={ele.value}> { ele.label } </option> 
                    })}
                </select>
                <input type="text" value={form.amount} onChange={(e) => { setForm({...form, amount: e.target.value }) }} /> 
                <button type="button" onClick={addCategory}>Add Category</button>
                <label htmlFor="socialLinks">Social media links</label><br />
                <input
                    type="text"
                    value={form.socialLinks}
                    onChange={handleChange}
                    name="socialLinks"
                    id="socialLinks"
                    className="form-control"
                />
                <br />

                <label htmlFor="location">Add Location</label><br />
                <input
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    name="location"
                    id="location"
                    className="form-control"
                />
                <br />

                <br />
                <input type="Submit" />
            </form>
        </div>
    )
}