import React, { useEffect, useState } from 'react';

const style = {
    container: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontFamily: 'inherit'
    },
    fullWidth: {
        width: '100%',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    fullLabel: {
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'inherit'
    },
    halfLabel: {
        width: '49%',
        boxSizing: 'border-box',
        fontFamily: 'inherit'
    },
    button: {
        width: '100%',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    }
}

const AutoComplete = ({
    placesKey,
    inputId,
    setAddress,
    required
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
    const clear = (e) => {
        if (e) e.preventDefault()
        setInput('')
        setAddressName('')
        setStreet('')
        setCity('')
        setCountry('')
        setPostCode('')
        setFormattedAddress('');
    }

    //on mount, load google auto complete 
    useEffect(() => {
        const renderGoogle = () => {
            window[inputId] = new window.google.maps.places.Autocomplete(
                document.getElementById(inputId),
                {}
            );
            const handlePlaceSelect = () => {
                const place = window[inputId].getPlace();
                clear()
                setFormattedAddress(place.formatted_address);
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
            window[inputId].addListener("place_changed", handlePlaceSelect)
        }

        //if places script is already found then listen for load and then renderGoogle
        let found = document.getElementById('placesScript') ? true : false;
        if (!found) {
            const script = document.createElement("script");
            script.id = 'placesScript';
            script.src = "https://maps.googleapis.com/maps/api/js?key=" + placesKey + "&libraries=places";
            script.async = true;
            script.onload = () => renderGoogle();
            document.body.appendChild(script);
        }
        if (found) {
            document.getElementById('placesScript').addEventListener('load', renderGoogle);
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
                Number or House Name:
                <input
                    id="addressName"
                    type="text"
                    style={style.fullWidth}
                    value={addressName || ''}
                    onChange={(e) => setAddressName(e.target.value)}
                    required={required && required}
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
                    required={required && required}
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
                    required={required && required}
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
                    required={required && required}
                />
            </label>
            <button
                style={style.button}
                onClick={(e) => clear(e)}
            >
                Clear Address
            </button>
        </div>
    )
}

export default AutoComplete