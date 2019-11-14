module.exports = () => {    
    return new Date().getTime() & 0xffffffff;
}