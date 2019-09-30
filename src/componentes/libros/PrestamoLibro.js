import React, { Component } from 'react';
import { compose } from 'redux';
//this connect a component from react with a store from redux 
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'; 
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

//custom redux action import
import {buscarUsuario} from '../actions/buscarUsuarioActions';

class PrestamoLibro extends Component {
    state = { 
        busqueda: '',
        noResultado: false
     }

    leerDato = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
    solicitarPrestamo = () => {
        const { usuario } = this.props;
        console.log('props ' , this.props);
        console.log('usuario solicitante de prestamo ', usuario);
        usuario.fecha_solicitud = new Date().toLocaleDateString();

        let prestados = [];
        //here Im'm making a copy of the original array, because it's unmutable
        prestados = [...this.props.libroView.prestados, usuario];

        const libro = {...this.props.libroView};

        delete libro.prestados;

        libro.prestados = prestados;

        const { history, firestore } = this.props;

        //the second parameter is the book to update
        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libro).then(history.push('/'));

        console.log(prestados);
    }

    buscarAlumno = e => {
        console.log('bucsa');
        e.preventDefault();
        const { busqueda } = this.state;

        //IMPORTANT: buscarUsuario is defined into the props
        const { firestore, buscarUsuario } = this.props;
        const coleccion = firestore.collection('suscriptores');
        const consulta = coleccion.where("codigo", "==", busqueda).get();

        consulta.then(resultado => {
            console.log(resultado);

            //saving the found user in the state of redux
            if (resultado.empty) {
                buscarUsuario({});
                this.setState({
                    noResultado: true
                });
            } else {
                const datos = resultado.docs[0];
                buscarUsuario(datos.data());
                this.setState({
                    noResultado: false
                });
            
            }
        })
    }

    render() { 

        const { libroView } = this.props;
        
        if (!libroView) return <Spinner/>

        const { noResultado, busqueda } = this.state;
        let fichaAlumno = null, btnSolicitar = null;
        const { usuario } = this.props;
        console.log('usuario', usuario);
        if (usuario.nombre) {
            fichaAlumno = <FichaSuscriptor 
                                alumno={usuario}
                            />
            btnSolicitar = <button 
                            className="btn btn-primary btn-block" 
                            type="button" 
                            onClick={this.solicitarPrestamo}>Solicitar Prestamo</button>
        }
        let mensajeResultado = null;
        if (noResultado) {
            mensajeResultado = <div class="alert alert-danger text-center font-weight-bold mt-4">No hay resultados</div>
        }
        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={'/suscriptores'} className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left">{''}</i>
                        Volver al Listado 
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas">{''}
                            Solicitar Prestamo : { libroView.titulo }
                        </i>
                    </h2>
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-8">
                            <form onSubmit={this.buscarAlumno}>
                                <legend className="color-primary text-center">
                                    Busca suscriptor por código
                                </legend>
                                <div className="form-group">
                                    <label>Código:</label>  
                                    <input type="text" name="busqueda" 
                                        onChange={this.leerDato}
                                        placeholder="Código del Suscriptor" required 
                                        className="form-control"/>
                                </div>
                                <input type="submit" value="Buscar alumno" className="btn btn-success btn-block"/>
                            </form>
                            {fichaAlumno}
                            {btnSolicitar}
                            {mensajeResultado}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PrestamoLibro.propTypes = {
    firestore: PropTypes.object.isRequired
}
 
export default compose(
    firestoreConnect(props => [{
        collection: 'libros',
        storeAs: 'libro',
        doc: props.match.params.id
    }]),
    connect(({firestore: {ordered}, usuario}, props) => ({
        libroView: ordered.libro && ordered.libro[0],
        usuario: usuario
    }), { buscarUsuario })   
)(PrestamoLibro);

//here its important to enable the usage of the action buscarUsuario
//at the connect function I must recover the saved user into the custom store