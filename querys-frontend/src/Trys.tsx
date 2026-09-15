const Trys = () => {
    const handleClick = async () => {
        try{
            const respuesta = await fetch('/api/products/crud');
            console.log(await respuesta.json());
            if(!respuesta.ok){
                throw new Error('No se pudieron cargar los productos');
            }
        } catch (requestError) {
            console.error('Error de conexión', requestError);
        }
    }

    return (
        <button className="btn btn-primary" onClick={handleClick}>Try</button>
    );
}
 
export default Trys;