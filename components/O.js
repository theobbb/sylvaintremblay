import React from 'react'
import Text from './blocks/Text'

const O = ({ o }) => {

    if (o.type == 'Text') {
        return (
            <Text o={o} />
        )
    }
    else {
        return (
            <></>
        )
    }
    

}

export default O
