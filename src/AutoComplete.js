import React, { useEffect, useState } from 'react';

const style = {
    container: {
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    fullWidth: {
        width: '100%',
        marginTop: '10px',
        padding: '10px 5px',
        boxSizing: 'border-box'
    },
    fullLabel: {
        width: '100%',
        margin: '10px 0',
        boxSizing: 'border-box'
    },
    halfLabel: {
        width: '49%',
        margin: '10px 0',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        marginTop: '30px',
        padding: '10px 5px',
        boxSizing: 'border-box'
    }
}

const AutoComplete = ({
    placesKey,
    inputId,
    setAddress
}) => {
    //input state
    const [input, setInput] = useState('');
    const [addressName, setAddressName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postCode, setPostCode] = useState('');
    const [formattedAddress, setFormattedAddress] = useState('');

    //functionally clear all state
    const clear = () => {
        setInput('')
        setAddressName('')
        setStreet('')
        setCity('')
        setCountry('')
        setPostCode('')
    }

    //on mount, load google auto complete 
    useEffect(() => {
        const renderGoogle = () => {
            const autoComplete = new window.google.maps.places.Autocomplete(
                document.getElementById(inputId),
                {}
            );
            const handlePlaceSelect = () => {
                const place = autoComplete.getPlace();
                setFormattedAddress(place.formatted_address);
                clear()
                console.log(place)
                for (const component of place.address_components) {
                    const type = component.types[0];
                    switch (type) {
                        case 'street_number':
                            setAddressName(component.long_name)
                            break;
                        case 'premise':
                            addressName === '' ?
                                setAddressName(component.long_name) :
                                setAddressName(component.long_name + ', ' + addressName)
                            break;
                        case 'route':
                            setStreet(component.long_name)
                            break;
                        case 'postal_town':
                            setCity(component.long_name)
                            break;
                        case 'administrative_area_level_2':
                            city === '' &&
                                component.long_name === 'Greater London' ?
                                setCity('London') :
                                setCity(component.long_name)
                            break;
                        case 'neighborhood':
                            if (city === '') setCity(component.long_name)
                            break;
                        case 'country':
                            setCountry(component.long_name)
                            break;
                        case 'postal_code':
                            setPostCode(component.long_name)
                            break;
                        default:
                            console.log('irrelevant component type')
                            break;
                    }
                }
            }

            //listen for place change in input field
            autoComplete.addListener("place_changed", handlePlaceSelect)
        }

        if (!window.google) {
            const script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key=" + placesKey + "&libraries=places";
            script.async = true;
            script.onload = () => renderGoogle();
            document.body.appendChild(script);
        }
    }, [placesKey, inputId, addressName, city])

    //return address object to parent for your use case
    useEffect(() => {
        const addressObject = {
            formattedAddress: formattedAddress,
            addressName: addressName,
            street: street,
            city: city,
            country: country,
            postCode: postCode
        };
        setAddress(addressObject);
    }, [formattedAddress, addressName, street, city, country, postCode, setAddress])

    //listen for mobile screen size
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const screenSize = (e) => {
            const w = e.target.innerWidth;
            w < 600 ?
                setMobile(true) :
                setMobile(false)
        }
        window.addEventListener('resize', screenSize);
    }, [])

    return (
        <div style={style.container}>
            <label style={style.fullLabel}>
                Location Search:
                <input
                    id={inputId}
                    type="text"
                    style={style.fullWidth}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </label>
            <label style={!mobile ? style.halfLabel : style.fullLabel}>
                Number / Name:
                <input
                    id="addressName"
                    type="text"
                    style={style.fullWidth}
                    value={addressName || ''}
                    onChange={(e) => setAddressName(e.target.value)}
                    required
                />
            </label>
            <label style={!mobile ? style.halfLabel : style.fullLabel}>
                Street:
                <input
                    id="street"
                    type="text"
                    style={style.fullWidth}
                    value={street || ''}
                    onChange={(e) => setStreet(e.target.value)}
                />
            </label>
            <label style={!mobile ? style.halfLabel : style.fullLabel}>
                City:
                <input
                    id="city"
                    type="text"
                    style={style.fullWidth}
                    value={city || ''}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </label>
            <label style={!mobile ? style.halfLabel : style.fullLabel}>
                Country: 
                <input
                    id="country"
                    type="text"
                    style={style.fullWidth}
                    value={country || ''}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
            </label>
            <label style={!mobile ? style.halfLabel : style.fullLabel}>
                Post Code:
                <input
                    id="postCode"
                    type="text"
                    style={style.fullWidth}
                    value={postCode || ''}
                    onChange={(e) => setPostCode(e.target.value)}
                    required
                />
            </label>
            <button
                style={style.button}
                onClick={() => clear()}
            >
                Clear Address
            </button>
        </div>
    )
}

export default AutoComplete