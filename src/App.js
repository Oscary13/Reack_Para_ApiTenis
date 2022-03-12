import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://127.0.0.1:8000/api/teni/";

class App extends Component {
state={
  data:[],
  modalInsertar: false,
  modalEliminar: false,
  form:{
    id: '',
    marca: '',
    modelo: '',
    color: '',
    talla: '',
    precio: '',
    imagen: ''
  }
}

peticionGet=()=>{
axios.get(url).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.id;
 await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message); 
  })
}

peticionPut=()=>{
  axios.post(url+this.state.form.id, this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarEmpresa=(empresa)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      id: empresa.id,
      marca: empresa.marca,
      modelo: empresa.modelo,
      color: empresa.color,
      talla: empresa.talla,
      precio: empresa.precio,
      imagen: empresa.imagen,
      
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;
  return (
    <body>
      <div className="App">
    <br /><br /><br />
  <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>AGREGAR TENI</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>MARCA</th>
          <th>MODELO</th>
          <th>COLOR</th>
          <th>TALLA</th>
          <th>PRECIO</th>
          <th>IMAGEN</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(empresa=>{
          return(
            <tr>
          <td>{empresa.id}</td>
          <td>{empresa.marca}</td>
          <td>{empresa.modelo}</td>
          <td>{empresa.color}</td>
          <td>{empresa.talla}</td>
          <td><strong>$</strong> {empresa.precio}</td>
          <td>{empresa.imagen}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarEmpresa(empresa); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarEmpresa(empresa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>

 

    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="marca">Marca</label>
                    <input className="form-control" type="text" name="marca" id="marca" onChange={this.handleChange} value={form?form.marca: ''}/>
                    <br />
                    <label htmlFor="modelo">Modelo</label>
                    <input className="form-control" type="text" name="modelo" id="modelo" onChange={this.handleChange} value={form?form.modelo: ''}/>
                    <br />
                    <label htmlFor="color">Color</label>
                    <input className="form-control" type="text" name="color" id="color" onChange={this.handleChange} value={form?form.color: ''}/>
                    <br />
                    <label htmlFor="talla">Talla</label>
                    <input className="form-control" type="text" name="talla" id="talla" onChange={this.handleChange} value={form?form.talla: ''}/>
                    <br />
                    <label htmlFor="precio">Precio</label>
                    <input className="form-control" type="text" name="precio" id="precio" onChange={this.handleChange} value={form?form.precio: ''}/>
                    <br />
                    <label htmlFor="imagen">imagen</label>
                    <input className="form-control" type="file" name="imagen" id="imagen" onChange={this.handleChange} value={form?form.imagen: ''}/>
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal =='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar este Teni {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>
  </body>

  );
}
}
export default App;
