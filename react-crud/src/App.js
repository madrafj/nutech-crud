
import { useEffect, useState } from 'react';
import './style.css';
import { BarangGridView, BarangListView, DeleteDialog, FormBarang } from './view';
import Axios from 'axios';
import datauriToBlob from './converter';


const App = () => {
  const [data, setData] = useState(undefined);
  const [viewMode, setMode] = useState('list');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(undefined);
  
  const receiveData = rawData => {
    let tempData = rawData.data;
    tempData.map(v=> {
      let str = v.fotoBarang;
      let blob = datauriToBlob(str);
      v.fotoBarang = blob;
      return v;
    })
    setData(tempData);
  }  
  
  const refreshData = () => {
    Axios.get("http://localhost:3002/api/get").then(data => {
      receiveData(data);
    });
    setPage(1);
  }
 
  const handleFilter = () => {
    console.log(keyword)
    if (keyword) {
      Axios.get("http://localhost:3002/api/filter/" + keyword).then(data => {
        receiveData(data);
      })
    }
    else {
      refreshData();
    }
  }
  
  const handleEdit = item => {
    const formEdit = <FormBarang onClose={closeModal} prevData={item} />
    setModal(formEdit);
  }

  const handleDelete = nama => {
    const deleteDialog = <DeleteDialog nama={nama} onClose={() => closeModal()} />
    setModal(deleteDialog);
  }

  const closeModal = () => {
    refreshData();
    setModal(undefined);
  }

  useEffect(() => {
    refreshData();
  }, [])
  
  return (
    <div className="main">
      <div className="header">DATA BARANG</div>
      <div className="filter-bar">
        <label>
          Tampilan : 
          <select value={viewMode} onChange={e => setMode(e.target.value)}>
            <option value="list" label="Tabel"></option>
            <option value="grid" label="Grid"></option>
          </select>
        </label>
        <label>
          Cari Barang : 
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} />
          <button onClick={handleFilter}>Cari</button>
        </label>
      </div>
      {
        viewMode === 'list'
        ? <BarangListView data={data} onEditItem={handleEdit} onDeleteItem={e => handleDelete(e)} />
        : <BarangGridView data={data} />
      }
      <div className="pagination">
        <span>prev</span>
        <span></span>
        <span>next</span>
      </div>
      <button className="btn-big"
        onClick={() => setModal(<FormBarang onClose={closeModal} />)}
      >
        Tambah Baru
      </button>
      { modal }
    </div>
  )
}

export default App;
