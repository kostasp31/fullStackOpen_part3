import { useState, useEffect } from 'react'
import personsService from './services/persons'

const NotificationSuccess = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
        <div className='msgSuccess'>
            {message}
        </div>
    )
}

const NotificationFailure = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
        <div className='msgFail'>
            {message}
        </div>
    )
}

const Person = ({person, filter, delPerson}) => {
    if (person.name.includes(filter)) {
        return (
            <div>
                {person.name} {person.number} <button onClick={() => delPerson(person)}>delete</button>
            </div>
        )
    }
}

const Title = ({title}) => <h2>{title}</h2>

const Filter = ({filter, handleFilterChange}) => {
    return (
    <div>
        Filter shown with:
        <form onSubmit={(event) => event.preventDefault()}>
            <input
            value={filter}
            onChange={handleFilterChange}
            />
        </form>
    </div>
    )
}

const NewPerson = ({newName, newNumber, handleNameChange, handleNumberChange, addPhone}) => {
    return (
    <div>
        <Title title="Add a new" />
        <form onSubmit={addPhone}>
        <div>
            name: <input 
            value={newName}
            onChange={handleNameChange}
            />
        </div>
        <div>
            number: <input 
            value={newNumber}
            onChange={handleNumberChange}
            />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
        </form>
    </div>
    )
}

const Display = ({persons, filter, delPerson}) => {
    return (
        <div>
            <Title title="Numbers" />
            <div>
            { persons.map(person => <Person key={person.id} person={person} filter={filter} persons={persons} delPerson={delPerson} /> ) }
            </div>
        </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [messageS, setMessageS] = useState(null)    // message for success
  const [messageF, setMessageF] = useState(null)    // and failure

  const hook = () => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
    }
    
    useEffect(hook, [])

    const delPerson = (person) => {
        if (!window.confirm(`Delete ${person.name}?`))
            return
        personsService
            .del(person.id)
            .then(
                response => {
                    const newPersons = persons.filter(n => n.id !== person.id)
                    setPersons(newPersons)

                    setMessageS(
                        `Successfully deleted ${person.name}`
                    )
                    clearTimeout()
                    setTimeout(() => {setMessageS(null)}, 5000)
                }
            )
            .catch(
                error => {
                    setPersons(persons.filter(n => n.id !== person.id))
                    setMessageF(
                        `Information of ${person.name} has already been removed from the server`
                    )
                    clearTimeout()
                    setTimeout(() => {setMessageF(null)}, 5000)
                }
            )
    }

  const addPhone = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    const newPerson = {
        name:newName,
        number:newNumber
    }

    const itm = persons.find(person => person.name === newName)
    if (itm !== undefined) {
        let res = window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)
        if (!res) { 
            setNewPerson('')
            setNewNumber('')
            return 
        }
        else {
            personsService
                .replace(itm.id, newPerson)
                .then(
                    response => {
                        setPersons(persons.map(n => n.id !== itm.id ? n : response.data))
                        setNewPerson('')
                        setNewNumber('')

                        setMessageS(
                            `Changed number of ${newPerson.name}`
                        )
                        clearTimeout()
                        setTimeout(() => {setMessageS(null)}, 5000)
                    }
                )
                .catch(
                    error => {       
                        if (error.name === 'AxiosError') {
                            setMessageF(
                                `${error.response.data.error}`
                            )
                            clearTimeout()
                            setNewPerson('')
                            setNewNumber('')
                            setTimeout(() => {setMessageF(null)}, 5000)
                        }
                        else {                
                            // console.log(`fail, gonna remove ${itm.id} ${itm.name} ${itm.number}`)
                            // console.log(error)
                            setPersons(persons.filter(n => n.id !== itm.id))
                            setMessageF(
                                `Information of ${newPerson.name} has already been removed from the server`
                            )
                            clearTimeout()
                            setTimeout(() => {setMessageF(null)}, 5000)
                        }
                    }
                )
                
        }
        return
    }

    personsService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewPerson('')
        setNewNumber('')

        setMessageS(
          `Added ${newPerson.name} to the phonebook`
        )
        clearTimeout()
        setTimeout(() => {setMessageS(null)}, 5000)
      })  
      .catch(
        error => {
            if (error.name === 'AxiosError') {
                setMessageF(
                    `${error.response.data.error}`
                )
                clearTimeout()
                setNewPerson('')
                setNewNumber('')
                setTimeout(() => {setMessageF(null)}, 5000)
            }
            return
        }
      )
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewPerson(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  return (
    <div>
      <Title title="Notebook" />
      <NotificationSuccess message={messageS} />
      <NotificationFailure message={messageF} />
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <NewPerson 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        newName={newName} 
        newNumber={newNumber} 
        addPhone={addPhone} 
      />
      <Display persons={persons} filter={filter} delPerson={delPerson} />
    </div>
  )
}

export default App