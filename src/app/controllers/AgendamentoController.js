import User from "../models/User";
import Agendamento from "../models/Agendamento";

import { startOfHour, parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';

class AgendamentoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Existem campos inválidos."});
    }

    const { provider_id, date } = req.body;

    //Checando se o provider_id é provider
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      }
    });

    if (!isProvider) {
      return res.status(401).json({ error: "Você só pode criar agendamentos com fornecedores." });
    }

    //Só pega a hora, os minutos e segundos ele zera
    const hourStart = startOfHour(parseISO(date));

    //Verifica se a data passada na requisicao ja passou
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "A data não é permitida pois já passou." });
    }

    //Checando se a hora esta disponivel
    const checkAvailability = await Agendamento.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: "O horário escolhido naão está disponivel." });
    }

    const agendamento = await Agendamento.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    res.json(agendamento);
  }
}

export default new AgendamentoController();
