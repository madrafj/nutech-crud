
const LabelItem = ({ label, nilai }) => {
  return (
    <div className="item-label">
      <span>{label}</span>
      <span>{nilai}</span>
    </div>
  )
}

export const LabelInput = ({ label, number, value, onValChange }) => {
  return (
    <label>
      { label }
      <input type={number ? 'number' : 'text'}
        onChange={e => onValChange(e.target.value)}
        value={value}
      />
    </label>
  )
}

export const ImagePicker = ({onValChange}) => {
  return (
    <label className="file-picker" htmlFor="picker">
      Upload Foto
      <input type="file" id="picker"
        accept="image/png, image/jpeg, image/jpg"
        onChange={e => onValChange(e.target.files)}
      />
    </label>
  )
}

export const ItemBarangGrid = ({ nama, gambar, hargaJual, hargaBeli, stok }) => {
  return (
    <div className="item-container">
      <span className="item-title"> {nama} </span>
      <img src={gambar} alt={nama} className="item-picture"></img>
      <LabelItem label="harga beli" nilai={hargaBeli} />
      <LabelItem label="harga jual" nilai={hargaJual} />
      <LabelItem label="stok" nilai={stok} />
    </div>
  )
}

export const ItemBarangList = ({ nama, gambar, hargaJual, hargaBeli, stok, header, onEdit, onDelete }) => {
  return (
    <div className={header ? 'record field' : 'record'}>
      {
        header ? <span>Foto Barang</span>
        : <div><img src={gambar} alt={nama} /></div>
      }      
      <span> {nama} </span>
      <span> {hargaBeli} </span>
      <span> {hargaJual} </span>
      <span> {stok} </span>
      {
        !header &&
          <span class="record-action">
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Hapus</button>
          </span>
      }
    </div>
  )
}

