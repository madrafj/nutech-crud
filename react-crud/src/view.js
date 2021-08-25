import Axios from "axios";
import { useEffect, useState } from "react"
import { ImagePicker, ItemBarangGrid, ItemBarangList, LabelInput} from "./components"

export const BarangListView = ({data, onEditItem, onDeleteItem}) => {
  const FieldBarangList = (
    <ItemBarangList header
      nama="Nama Barang"
      hargaBeli="Harga Beli"
      hargaJual="Harga Jual"
      stok="Jumlah Stok"
    />
  )

  return (
    <div className="list-view">
      { FieldBarangList }
      {
        data && data.map(v => {
          return (
            <ItemBarangList nama={v.namaBarang}
              gambar={URL.createObjectURL(v.fotoBarang)}
              hargaBeli={v.hargaBeli}
              hargaJual={v.hargaJual}
              stok={v.stok}
              onEdit={() => onEditItem(v)}
              onDelete={() => onDeleteItem(v.namaBarang)}
            />
          )
        })
      }
    </div>
  )
}

export const BarangGridView = ({data}) => {
  return (
    <div className="grid-view">
      {
        data &&
        data.map(v => {
          return (
            <ItemBarangGrid nama={v.namaBarang}
            gambar={URL.createObjectURL(v.fotoBarang)}
            hargaBeli={v.hargaBeli}
            hargaJual={v.hargaJual}
            stok={v.stok}
          />
          )
        })
      }
    </div>
  )
}



const emptyData = {
  namaBarang: '',
  hargaBeli: '',
  hargaJual: '',
  stok: '',
  fotoBarang: null
}

export const FormBarang = ({onClose, prevData}) => {
  const [data, setData] = useState(emptyData);
  const [prevName, setPrevName] = useState('')
  const [listNama, setListNama] = useState([]);
  const [imgUrl, setImg] = useState('');
  
  useEffect(() => {
    Axios.get("http://localhost:3002/api/getNama").then(dt => {
      if (dt.data) {
        const nameList = dt.data.map(v => v.namaBarang);
        setListNama(nameList);
      }
    })
    if (prevData) {
      setData(prevData);
      setPrevName(prevData.namaBarang);
    }
  }, [])

  useEffect(() => {
    if (data.fotoBarang) {
      const tempURL = URL.createObjectURL(data.fotoBarang);
      setImg(tempURL);
    }
    else {
      setImg('');
    }
  }, [data.fotoBarang])

  const handleChange = newValue => {
    let newData = {...data, ...newValue};
    setData(newData);
  }

  const handleNameChange = nama => {
    let newData = { namaBarang: nama }
    if (prevData || (!listNama.includes(nama))) {
      handleChange(newData);
    }
    else {
      alert('Nama Sudah Dipakai, silahkan cari nama lain');
      handleChange({ namaBarang: '' });
    }
  }

  const handleImageChange = files => {
    const imgSrc = files[0];
    const accept = ['image/jpeg', 'image/png'];
    if (!imgSrc) { return }
    if (!accept.includes(imgSrc.type)) {
      alert('Hanya menerima tipe file JPG dan PNG');
      return;
    }
    if (imgSrc.size < 1000000) {
      handleChange({fotoBarang: imgSrc});
    }
    else {
      alert('File Tidak boleh melebihi 100kb.');
    }
  }

  const handleReset = () => {
    if (prevData) {
      setData(prevData);
    }
    else {
      setData(emptyData);
    }
  }

  const handleSave = () => {
    const file = data.fotoBarang;
    let reader = new FileReader();
    reader.onloadend = e => {
      let dataurl = e.target.result;
      let tempData = {...data, fotoBarang: dataurl}
      if (prevData) {
        Axios.post("http://localhost:3002/api/update", {...tempData, prevName: prevName})
        alert('Data berhasil disimpan.');
        onClose();
      } else {
        Axios.post("http://localhost:3002/api/create", tempData)
        alert('Data berhasil disimpan.');
        onClose();   
      }
    }
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal">
      <div className="form-barang">
        <span className="form-header">
          { prevData ? 'Form Edit Barang' : 'Form Tambah Barang' }
        </span>
        <div className="picture-box"
          style={{backgroundImage: `url(${imgUrl})`}}
        >
          <ImagePicker onValChange={handleImageChange} />
        </div>
        <LabelInput label="Nama Barang"
          value={data.namaBarang}
          onValChange={handleNameChange}
        />
        <LabelInput label="Harga Beli" number
          value={data.hargaBeli}
          onValChange={val => handleChange({hargaBeli: val})}
        />
        <LabelInput label="Harga Jual" number
          value={data.hargaJual}
          onValChange={val => handleChange({hargaJual: val})}
        />
        <LabelInput label="Jumlah Stok" number
          value={data.stok}
          onValChange={val => handleChange({stok: val})}
        />
        <button className="btn-big" onClick={handleReset}>
          Reset
        </button>
        <button className="btn-big" onClick={handleSave}>Simpan</button>
        <span className="close-modal"
          onClick={onClose}
        >
          &times;
        </span>
      </div>
    </div>
  )
}

export const DeleteDialog = ({nama, onClose}) => {
  const deleteItem = () => {
    Axios.delete("http://localhost:3002/api/delete/" + nama);
    alert('Data berhasil dihapus.')
    onClose();
  }

  return (
    <div className="modal">
      <div className="dd-box">
        <span>Apakah anda yakin<br/> ingin menghapus {nama} ?</span>
        <button onClick={() => onClose()}>Batal</button>
        <button onClick={() => deleteItem()}>Hapus</button>
      </div>
    </div>
  )
}