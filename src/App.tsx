import { useState } from 'react'
import './styles/global.css'

import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'

// pega os dados, transforma em objetos e define propriedades
const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList).transform((list) => list.item(0)),
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .refine((email) => {
      return email.endsWith('paominha.com.br')
    }),
  password: z.string().min(6, 'A senha precisa de, no mínimo, 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O título é obrigatório'),
        knowledge: z.coerce.number().min(1).max(100), // coerce faz a conversao
      }),
    )
    .min(2, 'Insira pelo menos 2 tecnologias'),
})
//  z.infer() é uma função do zod que permite extrair o tipo inferido com base em um esquema de validação.
// o uso de < > com z.infer<typeof createUserFormSchema> é uma notação de tipo genérico que permite passar o tipo createUserFormSchema como parâmetro para a função z.infer e obter o tipo inferido correspondente.
type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [output, setOutput] = useState('')
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({
      title: '',
      knowledge: 0,
    })
  }

  // vai receber os dados do formulário
  async function createUser(data: any) {
    console.log(data.avatar)
    await supabase.storage
      .from('forms-react')
      .upload(data.avatar.name, data.avatar)
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="flex flex-col gap-14 justify-center items-center h-screen text-sky-100 bg-slate-900 p-4">
      <h1 className="text-5xl text-indigo-500">Hook Forms</h1>
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-7  max-w-[500px] w-[100%]"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[20px] text-slate-200">
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="bg-slate-700 rounded p-[5px] h-10 outline-indigo-500"
              {...register('avatar')}
            />
            {errors.avatar && (
              <span className="text-gray-300">{errors.avatar.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[20px] text-slate-200">
              Nome
            </label>
            <input
              type="name"
              id="name"
              className="bg-slate-700 rounded p-2 h-10 outline-indigo-500"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-gray-300">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[20px] text-slate-200">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="bg-slate-700 rounded p-2 h-10 outline-indigo-500"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-gray-300">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[20px] text-slate-200">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className=" bg-slate-700 p-2 rounded h-10 outline-indigo-500"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-gray-300">{errors.password.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-[20px] text-slate-200 flex justify-between"
          >
            Tecnologias
            <button
              type="button"
              className="text-indigo-400 py-1 px-2 text-[18px] rounded ml-4"
              onClick={addNewTech}
            >
              Adicionar
            </button>
          </label>
          <div className="max-h-48 overflow-y-auto scroll-p-1 snap-y grid gap-2 p-1">
            {fields.map((field, index) => {
              return (
                <div className="snap-start flex gap-3" key={field.id}>
                  <div className="flex flex-1 gap-2 flex-col">
                    <input
                      type="texts"
                      id="techs"
                      className="w-full bg-slate-700 p-2 rounded h-10 caret-indigo-500 outline-indigo-500"
                      {...register(`techs.${index}.title`)}
                    />
                    {errors.techs?.[index]?.title && (
                      <span className="text-gray-300">
                        {errors.techs?.[index]?.title?.message}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 flex-col w-28">
                    <input
                      type="number"
                      id="knowledge"
                      className=" bg-slate-700 p-2 rounded h-10 caret-indigo-400 outline-indigo-500"
                      {...register(`techs.${index}.knowledge`)}
                    />
                    {errors.techs?.[index]?.knowledge && (
                      <span className="text-gray-300">
                        {errors.techs?.[index]?.knowledge?.message}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {errors.techs && (
              <span className="text-gray-400">{errors.techs?.message}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white text-[24px] rounded p-2"
        >
          Salvar
        </button>

        <footer>{output}</footer>
      </form>
    </main>
  )
}

export default App
