import TableDataPeople from "./TableDataPeople"
import TableHeaderPeople from "./TableHeaderPeople"
import starWarsApi from "../../services/starwarsApi"
import { useState, useEffect } from "react"
import Button from "../Button"
import SearchBar from "../SearchBar"

interface DataPeople {
  name: string
  height: string
  mass: string 
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: []
  species: []
  vehicles: []
  starships: []
}

function TablePeoples() {
  const [peoples, setPeoples] = useState<DataPeople[]>([])
  const [page, setPage] = useState<string>('people')
  const [next, setNext] = useState<string>('')
  const [previous, setPrevious] = useState<string>('')
  const [eyeColors, setEyeColors] = useState<[]>([])
  const [eyeColor, setEyeColor] = useState<string>('')
  const [skinColors, setSkinColors] = useState<[]>([])
  const [skinColor, setSkinColor] = useState<string>('')

  async function getPeoplesWithOrWithOutFilters() {
    const response = await starWarsApi.get(`${page}`)
    const peoples = response.data.results 
    if(eyeColor === '' && skinColor === ''){
      return setPeoples(peoples)  

    } else if(eyeColor !== '' && skinColor == ''){
      const peoplesWithEyeFilter = peoples.filter((people: DataPeople) => {
        if(people.eye_color === eyeColor) return people
      })
      return setPeoples(peoplesWithEyeFilter)
    
    } else if(eyeColor === '' && skinColor !== ''){
      const peoplesWithSkinFilter = peoples.filter((people: DataPeople) => {
        if(people.skin_color === skinColor) return people
      })
      return setPeoples(peoplesWithSkinFilter)
    
    } else if(eyeColor !== '' && skinColor !== '') {
      const peoplesWithDubleFilter = peoples.filter((people: DataPeople) => {
        if(people.skin_color === skinColor && people.eye_color == eyeColor) return people
      })
      return setPeoples(peoplesWithDubleFilter)
    }
  }

  async function getNextAndPrevius() {
    const response = await starWarsApi.get(`${page}`)
    return (
      setNext(response.data.next),
      setPrevious(response.data.previous)
    )
  }

  async function getEyeColors() {
    const response = await starWarsApi.get(`${page}`)
    const peoples = response.data.results
    const eyeColors = peoples.map((people: DataPeople) => {
      return people.eye_color
    })
    const eyeColorsNotRepeat = eyeColors.filter((el: string, i: number) => {
      return eyeColors.indexOf(el) === i;
    });
    return setEyeColors(eyeColorsNotRepeat)
  }

  async function getSkinColors() {
    const response = await starWarsApi.get(`${page}`)
    const skinColors = response.data.results.map((people: DataPeople) => {
      return people.skin_color
    })
    const skynColorsNotRepeat = skinColors.filter((el: string, i: number) => {
      return skinColors.indexOf(el) === i;
    });
    return setSkinColors(skynColorsNotRepeat)
  }

  useEffect(() => {
    getPeoplesWithOrWithOutFilters()
    getNextAndPrevius()
    getEyeColors()
    getSkinColors()
  }, [page, eyeColor, skinColor])


  return (
    <div className="flex justify-center flex-col">
      <SearchBar
        skinColors={skinColors}
        methodSkin={setSkinColor} 
        eyeColors={eyeColors}
        methodEye={setEyeColor}
      />
      <table className="table-fixed">
        <thead>
          <TableHeaderPeople />
        </thead>
        <tbody>
          {peoples.map((people, i) => {
            return (
              <TableDataPeople
                key={i}
                name={people.name}
                height={people.height}
                mass={people.mass}
                hairColor={people.hair_color}
                skinColor={people.skin_color}
                eyeColor={people.eye_color}
                birthYear={people.birth_year}
                gender={people.gender}
                homeworld={people.homeworld}
                films={people.films}
                species={people.species}
                vehicles={people.vehicles}
                starships={people.starships}
              />
            )
          })}
        </tbody>
      </table>

      <div className="flex justify-center">
        <Button 
          text={'Previus'}
          execute={() => {
            previous !== null ? setPage(previous) : ''
          }}
        />
        <Button 
          text={'Next'} 
          execute={() => {
            next !== null ? setPage(next) : ''
          }} 
        />
      </div>

    </div>
  );
}

export default TablePeoples
