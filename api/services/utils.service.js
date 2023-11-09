const config = require( '../../config' );
const ultramsg = require( 'ultramsg-whatsapp-api' );
const instance_id = config.ULTRAMSG_INSTANCE_ID; // Replace with your Ultramsg instance ID
const ultramsg_token = config.ULTRAMSG_TOKEN; // Replace with your Ultramsg token
const from = config.ULTRAMSG_FROM_NUMBER; // Replace with your Ultramsg sender number

const api = new ultramsg( instance_id, ultramsg_token );

function checkDateIsValidFutureDate ( currentDate, dateToCompareWith )
{
    return dateToCompareWith.getTime() > currentDate.getTime();
}

function isValidDate ( date )
{
    try
    {
        if ( String( date ).length < 8 )
        {
            return false;
        } else
        {
            const timestamp = Date.parse( date );
            const convertedDate = new Date( timestamp );
            if ( convertedDate && convertedDate.getTime() )
            {
                return !isNaN( convertedDate.getTime() );
            } else
            {
                return false;
            }
        }
    } catch ( err )
    {
        return false;
    }
}

function checkDateIsPast ( currentDate, dateToCompareWith )
{
    return currentDate.getTime() > dateToCompareWith.getTime();
}

function isValidEmail ( email )
{
    return String( email )
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/
        );
}

function isValidNumber ( number )
{
    return !isNaN( number );
}

async function messageFormatter ( body, to, buttons )
{
    const message = {
        body,
        to,
        from,
    };

    if ( buttons )
    {
        message.buttons = buttons;
    }

    return message;
}


async function sendMessage ( message )
{
    try
    {
        const response = await api.sendChatMessage( message.to, message.body );

        console.log( "Chat ID:", message.to );
        console.log( "Message Body:", message.body );
        console.log( "Message sent successfully! Response:", response );
    } catch ( error )
    {
        console.error( "Error sending message:", error.message );
    }
}


module.exports = {
    checkDateIsPast,
    checkDateIsValidFutureDate,
    isValidDate,
    isValidEmail,
    isValidNumber,
    messageFormatter,
    sendMessage,
};