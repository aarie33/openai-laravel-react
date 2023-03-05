import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'
import { useForm } from '@inertiajs/inertia-react'

export default function Home(props) {
    const {title, errors, messages } = props;


    const { data, setData, post } = useForm({
      message: '',
    })

    const [progress, setProgress] = useState(false);
    
    function submit(e) {
      e.preventDefault();

      if (progress) {
        return;
      }
      setProgress(true);
      post('/', {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          // clear form
          setData('message', '');
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        }
      })
    }

  return (
    <div className='h-screen'>
        <div className="h-full pb-28 overflow-auto">
          { messages.map((item, index) => (
            <div className={`w-full p-4 whitespace-pre-line ${item.role == 'user' ? 'bg-white' : 'bg-green-200'}`} key={index}>
              {item.content}
            </div>
          ))}
        </div>
        <div className="bottom-0 left-0 right-0 p-4 bg-gray-100 w-100 fixed">
          <form className="flex items-center" onSubmit={submit}>
            <input 
                type="text" 
                className="border border-gray-200 h-9 rounded w-full px-2" 
                value={ data.message } 
                onChange={e => setData('message', e.target.value)}
                placeholder="Message" />

            <button
              className="
                bg-blue-600
                hover:bg-blue-700
                inline-block
                flex
                items-center
                h-9
                px-4
                rounded
                float-right
                cursor-pointer
                ml-2
                text-white
              "
              type='submit'
              onClick={ submit }
            >
              { progress ?
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              : '' }
              Submit
            </button>
          </form>
          <div className="py-1">{errors.message ? <div className="text-xs text-red-500">{errors.message}</div> : null}</div>
        </div>
      </div>
  )
}